// PULLBACK PENDING BY BRAND  (configuration table)
// One row per brand: Box + Product summed, Grand Total.
// Source: inbound.csv = SELECT * FROM data_tool_inbound_report (columns brand_name, box_qty, product_qty)
export default {
    id: "pullback-brand",
    title: "PULLBACK PENDING BY BRAND",
    theme: "inbound",
    source: "inbound",
    tableId: "tblInboundBrand",
    table: {
        groupLabel: "Brand",
        groupBy: "brand_name",
        measures: [
            { label: "Box",     field: "box_qty" },
            { label: "Product", field: "product_qty" }
        ],
        totalLabel: "Grand Total"
    }
};
