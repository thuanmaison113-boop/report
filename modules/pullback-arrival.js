// PULLBACK PENDING BY ARRIVAL DATE  (configuration table)
// Rows without an arrival_date are left out, as before.
export default {
    id: "pullback-arrival",
    title: "PULLBACK PENDING BY ARRIVAL DATE",
    theme: "inbound",
    source: "inbound",
    tableId: "tblInboundArrival",
    table: {
        groupLabel: "Arrival Date",
        groupBy: "arrival_date",
        measures: [
            { label: "Product", field: "product_qty" },
            { label: "Taras",   field: "taras_qty" },
            { label: "Paper",   field: "paper_qty" },
            { label: "VM",      field: "vm_qty" }
        ],
        totalLabel: "Grand Total"
    }
};
