// PUT-AWAY PENDING  (custom module, 2026-11-14)
// One row per shop waiting in a put-away bin (GR posted, put-away not confirmed yet).
// Source: putaway.csv = SELECT * FROM data_tool_putaway_pending
//   columns: batch, shop_code, shop_name, box_qty, product_qty, taras_qty, paper_qty, vm_qty
// Stuff = product + taras + paper + VM (everything in the shipment).

export default {
    id: "putaway-pending",
    title: "PUT-AWAY PENDING",
    theme: "inbound",
    source: "putaway",
    tableId: "tblPutawayPending",

    build(data, h) {
        const list = data.putaway
            .filter((r) => String(r.batch || "").trim())
            .map((r) => ({
                bin: String(r.batch).trim(),
                shop: [r.shop_code, r.shop_name].filter((x) => x !== undefined && String(x).trim() !== "").join("-"),
                box: h.toNumber(r.box_qty),
                stuff: h.toNumber(r.product_qty) + h.toNumber(r.taras_qty) + h.toNumber(r.paper_qty) + h.toNumber(r.vm_qty)
            }))
            .sort((a, b) => a.bin.localeCompare(b.bin) || a.shop.localeCompare(b.shop));

        let box = 0, stuff = 0;
        const rows = list.map((r) => {
            box += r.box; stuff += r.stuff;
            return [r.bin, r.shop, h.formatNumber(r.box), h.formatNumber(r.stuff)];
        });

        return {
            columns: ["Bin", "Shop", "Box", "Stuff"],
            rows,
            footer: [{ text: "Grand Total", colspan: 2 }, { text: h.formatNumber(box) }, { text: h.formatNumber(stuff) }]
        };
    }
};
