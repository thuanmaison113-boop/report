// ==========================================================
// START
// Entry point: builds the dashboard from config/dashboard-config.js.
// Tables live in modules/, shared code in core/.
// ==========================================================

import { sources, dashboard } from "./config/dashboard-config.js";
import { modules } from "./modules/index.js";
import { startDashboard } from "./core/dashboard-manager.js";

startDashboard({
    container: document.querySelector("main.dashboard"),
    modules,
    dashboard,
    sources
});
