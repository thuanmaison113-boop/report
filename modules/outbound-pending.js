// OUTBOUND TODAY - PENDING  (custom module)
// One row per order that is not posted, in file order, with the total order quantity.
import { isPosted } from "./outbound-posted.js";

export default {
    id: "outbound-pending",
    title: "OUTBOUND TODAY - PENDING",
    theme: "outbound",
    source: "outbound",
    tableId: "tblOutboundPending",

    build(data, h) {
        let total = 0;
        const rows = data.outbound
            .filter((r) => !isPosted(r))
            .map((r) => {
                const qty = h.toNumber(r.order_qty);
                total += qty;
                return [String(r.brand_name), String(r.shop_name), String(r.DO_num), String(r.type), h.formatNumber(qty)];
            });

        return {
            columns: ["Brand", "Shop", "DO Number", "Type", "Order Qty"],
            rows,
            footer: [{ text: "Grand Total", colspan: 4 }, { text: h.formatNumber(total) }]
        };
    }
};
