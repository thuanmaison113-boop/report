// ==========================================================
// DATA LOADER
// Loads each CSV source once (Papa Parse, same options as before)
// and shares the result between all panels that use it.
// ==========================================================

const cache = new Map();

export function loadCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
            error: (err) => reject(err)
        });
    });
}

// Load one named source from the config. Each file is downloaded only once.
export function loadSource(name, sources) {
    if (!cache.has(name)) {
        const file = sources[name];
        const promise = file
            ? loadCSV(file).then((rows) => {
                console.log(name, rows.length);
                return rows;
            })
            : Promise.reject(new Error(`Unknown data source "${name}"`));
        cache.set(name, promise);
    }
    return cache.get(name);
}

// Load every source a module needs.
// Returns an object keyed by source name, e.g. { inbound: [...], outbound: [...] }.
export async function loadSources(names, sources) {
    const list = Array.isArray(names) ? names : [names];
    const rows = await Promise.all(list.map((n) => loadSource(n, sources)));
    return Object.fromEntries(list.map((n, i) => [n, rows[i]]));
}
