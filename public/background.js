const KEYS = ['isEnabled'];

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

const updateRules = (data, isEnabled) => {
    const entries = Object.entries(data).filter(([key]) => !KEYS.includes(key));

    if (!isEnabled) {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: entries.map((_, index) => index + 1)
        });
        return;
    }

    const rules = entries.map(([key, mockResponse], index) => {
        const { method, path } = parseStorageKey(key);
        const condition = {
            urlFilter: `*${path}*`,
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

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(rule => rule.id),
        addRules: rules
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(null, (existing) => {
        const hasData = Object.keys(existing).some(k => !KEYS.includes(k));
        if (!hasData) {
            chrome.storage.local.set({ ...mockData, isEnabled: false }, () => {
                updateRules({ ...mockData, isEnabled: false }, false);
            });
        } else {
            updateRules(existing, existing.isEnabled ?? false);
        }
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;

    chrome.storage.local.get(null, (items) => {
        console.log('Current local storage state:', items);
        updateRules(items, items.isEnabled);
    });
});