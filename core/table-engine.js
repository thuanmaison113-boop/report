// ==========================================================
// TABLE ENGINE
// Builds the card + table markup used by every panel, and the
// generic "group and sum" table used by configuration modules.
//
// A TABLE MODEL is what every module produces:
//   {
//     columns: ["Brand", "Box", "Product"],          header labels
//     rows:    [["Pedro", "1,234", "56"], ...],      body cells (text)
//     footer:  [{ text: "Grand Total", colspan: 1 }, ...]   optional
//   }
// All text is escaped before it goes into the page.
// ==========================================================

export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
}

// Same number format as the original dashboard.
export function formatNumber(n) {
    return n.toLocaleString();
}

// Same number reading as the original dashboard: Number(value || 0).
export function toNumber(value) {
    return Number(value || 0);
}

// ----------------------------------------------------------
// Card shell
// ----------------------------------------------------------

export function createCard({ id, title, theme, wide }) {
    const card = document.createElement("section");
    card.className = "card" + (wide ? " card-wide" : "");
    card.dataset.module = id;

    const titleBar = document.createElement("div");
    titleBar.className = "card-title" + (theme ? " " + theme : "");
    titleBar.textContent = title;

    const body = document.createElement("div");
    body.className = "card-body";

    card.append(titleBar, body);
    return { card, body };
}

export function renderMessage(body, text, kind = "info") {
    body.innerHTML = `<p class="card-state card-state-${kind}">${escapeHtml(text)}</p>`;
}

// ----------------------------------------------------------
// Table model -> HTML
// ----------------------------------------------------------

export function renderTable(body, model, tableId) {
    const head = `<tr>${model.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;

    const rows = model.rows.map((r) =>
        `<tr>${r.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
    ).join("");

    const foot = model.footer
        ? `<tfoot><tr>${model.footer.map((f) =>
            `<th${f.colspan > 1 ? ` colspan="${f.colspan}"` : ""}>${escapeHtml(f.text)}</th>`
          ).join("")}</tr></tfoot>`
        : "";

    body.innerHTML =
        `<table${tableId ? ` id="${escapeHtml(tableId)}"` : ""}>` +
        `<thead>${head}</thead><tbody>${rows}</tbody>${foot}</table>`;
}

// ----------------------------------------------------------
// Configuration tables: filter -> group -> sum -> sort -> total
//
// spec = {
//   source:     "inbound",                         which data source
//   filter:     (row) => true,                     optional
//   groupLabel: "Brand",                           first column header
//   groupBy:    "brand_name" | (row) => key,       field name or function
//   skipEmpty:  true,                              drop rows whose key is empty (default true)
//   measures:   [ { label: "Product", field: "product_qty" }
//               | { label: "Box", value: (row) => number } ],
//   totalLabel: "Grand Total"                      optional; no footer when missing
// }
// Groups are sorted by key, exactly like Object.keys(...).sort() before.
// ----------------------------------------------------------

export function groupTable(rows, spec) {
    const keyOf = typeof spec.groupBy === "function" ? spec.groupBy : (r) => r[spec.groupBy];
    const valueOf = spec.measures.map((m) => m.value || ((r) => toNumber(r[m.field])));
    const skipEmpty = spec.skipEmpty !== false;

    const pivot = {};
    rows.filter(spec.filter || (() => true)).forEach((r) => {
        const key = keyOf(r);
        if (skipEmpty && !key) return;
        if (!pivot[key]) pivot[key] = spec.measures.map(() => 0);
        valueOf.forEach((fn, i) => { pivot[key][i] += fn(r); });
    });

    const totals = spec.measures.map(() => 0);
    const body = Object.keys(pivot).sort().map((key) => {
        pivot[key].forEach((v, i) => { totals[i] += v; });
        return [key, ...pivot[key].map(formatNumber)];
    });

    return {
        columns: [spec.groupLabel, ...spec.measures.map((m) => m.label)],
        rows: body,
        footer: spec.totalLabel
            ? [{ text: spec.totalLabel }, ...totals.map((t) => ({ text: formatNumber(t) }))]
            : null
    };
}
