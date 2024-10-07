const mockData = {
    '/api/users': [
        {"id": 1, "name": "John Doe"},
        {"id": 2, "name": "Jane Smith"},
        {"id": 3, "name": "Jane Austen"}
    ],
    '/api/products': [
        {"id": 1, "name": "Widget", "price": 9.99},
        {"id": 2, "name": "Gadget", "price": 19.99}
    ]
};

const updateRules = (data, isEnabled) => {
    if (!isEnabled) {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: Object.keys(data).map((_, index) => index + 1)
        });
        return;
    }

    const rules = Object.entries(data).map(([path, data], index) => ({
        id: index + 1,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                url: `data:application/json,${encodeURIComponent(JSON.stringify(data))}`
            }
        },
        condition: {
            urlFilter: `*${path}*`,
            resourceTypes: ["xmlhttprequest"]
        }
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(rule => rule.id),
        addRules: rules
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({...mockData, isEnabled: false}, () => {
        updateRules(mockData, false);
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;

    chrome.storage.local.get(null, (items) => {
        console.log('Current local storage state:', items);
        updateRules(items, items.isEnabled);
    });
});