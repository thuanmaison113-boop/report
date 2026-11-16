// ==========================================================
// DASHBOARD MANAGER
// Reads the configuration, creates one card per enabled panel in
// order, loads the data each panel needs and lets the module fill it.
// One broken panel shows its own error; the others still load.
// ==========================================================

import { loadSources } from "./data-loader.js";
import { createCard, renderMessage, renderTable, groupTable } from "./table-engine.js";
import * as helpers from "./table-engine.js";

export async function startDashboard({ container, modules, dashboard, sources }) {
    const registry = new Map(modules.map((m) => [m.id, m]));
    const jobs = [];

    dashboard
        .filter((entry) => entry.enabled !== false)
        .forEach((entry) => {
            // A stack = several panels on top of each other in ONE grid cell,
            // so a long panel next to it does not push them apart.
            if (Array.isArray(entry.stack)) {
                const stack = document.createElement("div");
                stack.className = "card-stack" + (entry.wide ? " card-wide" : "");
                container.append(stack);
                entry.stack
                    .filter((e) => e.enabled !== false)
                    .forEach((e) => addPanel(e, stack, registry, sources, jobs));
                return;
            }
            addPanel(entry, container, registry, sources, jobs);
        });

    await Promise.all(jobs);
}

function addPanel(entry, parent, registry, sources, jobs) {
    const module = registry.get(entry.module);

    if (!module) {
        const { card, body } = createCard({ id: entry.module, title: entry.title || entry.module });
        renderMessage(body, `No module "${entry.module}" is registered in modules/index.js.`, "error");
        parent.append(card);
        console.error(`Unknown module "${entry.module}"`);
        return;
    }

    const { card, body } = createCard({
        id: module.id,
        title: entry.title || module.title,
        theme: module.theme,
        wide: entry.wide ?? module.wide
    });
    parent.append(card);
    jobs.push(fillCard(module, body, sources));
}

async function fillCard(module, body, sources) {
    try {
        const data = await loadSources(module.source, sources);

        // Type A: configuration table
        if (module.table) {
            const rows = data[module.table.source || firstSource(module.source)];
            renderTable(body, groupTable(rows, module.table), module.tableId);
            return;
        }

        // Type B: custom module
        if (typeof module.build === "function") {
            renderTable(body, module.build(data, helpers), module.tableId);
            return;
        }

        renderMessage(body, `Module "${module.id}" has neither "table" nor "build".`, "error");
    } catch (err) {
        console.error(module.id, err);
        renderMessage(body, `Could not load this table: ${err.message || err}`, "error");
    }
}

function firstSource(source) {
    return Array.isArray(source) ? source[0] : source;
}
