// ==========================================================
// MODULE REGISTRY
// Every table module is imported once here. A module listed here
// but not in config/dashboard-config.js is simply not shown.
// ==========================================================

import pullbackBrand from "./pullback-brand.js";
import pullbackArrival from "./pullback-arrival.js";
import outboundPosted from "./outbound-posted.js";
import outboundPending from "./outbound-pending.js";
import putawayPending from "./putaway-pending.js";
import pdaPhone from "./pda-phone.js";

export const modules = [
    pullbackBrand,
    pullbackArrival,
    outboundPosted,
    outboundPending,
    putawayPending,
    pdaPhone
];
