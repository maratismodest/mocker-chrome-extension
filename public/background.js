const KEYS = ['isEnabled', 'disabledMocks'];

const parseStorageKey = (key) => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    for (const m of methods) {
        if (key.startsWith(`${m}:`)) {
            return { method: m.toLowerCase(), path: key.slice(m.length + 1) };
        }
    }
    return { method: null, path: key };
};

const mockData = {
    'GET:/api/users': [
        {"id": 1, "name": "John Doe"},
        {"id": 2, "name": "Jane Smith"},
        {"id": 3, "name": "Jane Austen"}
    ],
    'GET:/api/products': [
        {"id": 1, "name": "Widget", "price": 9.99},
        {"id": 2, "name": "Gadget", "price": 19.99}
    ]
};

// The URL path must end with `path` (any prefix such as host or base path is allowed,
// query string and hash are ignored). `*` in `path` matches any characters within the path.
const buildRegexFilter = (path) => {
    const pattern = path
        .split('*')
        .map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
        .join('[^?#]*');
    return `^[^?#]*${pattern}([?#].*)?$`;
};

const buildRules = (data) => Object.entries(data)
    .filter(([key]) => !KEYS.includes(key) && !(data.disabledMocks ?? []).includes(key))
    .map(([key, mockResponse], index) => {
        const { method, path } = parseStorageKey(key);
        const condition = {
            regexFilter: buildRegexFilter(path),
            resourceTypes: ["xmlhttprequest"]
        };
        if (method) {
            condition.requestMethods = [method];
        }
        return {
            id: index + 1,
            priority: 1,
            action: {
                type: "redirect",
                redirect: {
                    url: `data:application/json,${encodeURIComponent(JSON.stringify(mockResponse))}`
                }
            },
            condition
        };
    });

// Replaces all installed dynamic rules (not just the ones matching current storage),
// so removed or cleared mocks never stay active.
const syncRules = async () => {
    const items = await chrome.storage.local.get(null);
    const installed = await chrome.declarativeNetRequest.getDynamicRules();
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: installed.map(rule => rule.id),
        addRules: items.isEnabled ? buildRules(items) : []
    });
};

// Storage changes can fire in bursts (e.g. import), so run syncs one at a time.
let queue = Promise.resolve();
const scheduleSync = () => {
    queue = queue
        .then(syncRules)
        .catch(error => console.error('Failed to update mock rules:', error));
    return queue;
};

chrome.runtime.onInstalled.addListener(async () => {
    try {
        const existing = await chrome.storage.local.get(null);
        const hasData = Object.keys(existing).some(k => !KEYS.includes(k));
        if (!hasData) {
            await chrome.storage.local.set({ ...mockData, isEnabled: false });
        }
    } catch (error) {
        console.error('Failed to initialize mock data:', error);
    }
    await scheduleSync();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;
    scheduleSync();
});
