// ==========================================================
// DASHBOARD CONFIGURATION
// The only file you need to touch to show, hide or reorder tables.
// ==========================================================

// Data files. Paths are relative to index.html.
// The CSVs stay at the repository root so the existing data upload keeps working.
export const sources = {
    inbound: "inbound.csv",
    outbound: "outbound.csv",
    putaway: "putaway.csv",
    pda: "pda.csv"
};

// Panels, top to bottom, left to right (two per row on wide screens).
//   module   : id of a module registered in modules/index.js   (required)
//   enabled  : false hides the panel                          (default true)
//   title    : replaces the module's own title                (optional)
//   wide     : true makes the panel full width                (optional)
//   stack    : [ ...panels ] puts several panels on top of each other in one
//              column cell, so a long panel beside them leaves no gaps (optional)
export const dashboard = [
    { module: "pullback-brand",   enabled: true },
    { module: "pullback-arrival", enabled: true },
    { stack: [                                                   // left column, one under the other
        { module: "outbound-posted",  enabled: true },
        { module: "putaway-pending",  enabled: true },
        { module: "pda-phone",        enabled: true }
    ] },
    { module: "outbound-pending", enabled: true }                // right column: long list
];
