// OUTBOUND TODAY - POSTED  (configuration table)
// Posted = "check" is "posted" after trimming and lower-casing.
// Rows with an empty brand are kept (as before), so skipEmpty is false.
export const isPosted = (r) => String(r.check).trim().toLowerCase() === "posted";

export default {
    id: "outbound-posted",
    title: "OUTBOUND TODAY - POSTED",
    theme: "outbound",
    source: "outbound",
    tableId: "tblOutboundPosted",
    table: {
        filter: isPosted,
        groupLabel: "Brand",
        groupBy: "brand_name",
        skipEmpty: false,
        measures: [
            { label: "Product", field: "product_qty" },
            { label: "Paper",   field: "paper_qty" }
        ],
        totalLabel: "Grand Total"
    }
};
