// PDA PHONE NUMBERS  (custom module, 2026-11-15)
// One row per PDA that is assigned to a staff member and has a phone number.
// Source: pda.csv = SELECT * FROM data_tool_pda_phone_num
//   columns: NV (employee full name), pda_phone_number
// Phone numbers stay text, so the leading 0 is kept. Sorted by name (Vietnamese order).

export default {
    id: "pda-phone",
    title: "PDA PHONE NUMBERS",
    theme: "inbound",
    source: "pda",
    tableId: "tblPdaPhone",

    build(data, h) {
        const list = data.pda
            .filter((r) => String(r.NV || "").trim() && String(r.pda_phone_number || "").trim())
            .map((r) => ({
                name: String(r.NV).trim(),
                phone: String(r.pda_phone_number).trim()
            }))
            .sort((a, b) => a.name.localeCompare(b.name, "vi"));

        return {
            columns: ["Staff", "PDA Phone"],
            rows: list.map((r) => [r.name, r.phone]),
            footer: [{ text: "Total PDA" }, { text: h.formatNumber(list.length) }]
        };
    }
};
