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


chrome.runtime.onInstalled.addListener(() => {

    for (let [key, value] of Object.entries(mockData)) {
        chrome.storage.local.set({[key]: value})
    }
    // updateStorageContents()
    const rules = Object.entries(mockData).map(([path, data], index) => ({
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

});


chrome.storage.onChanged.addListener((changes, namespace) => {
    const res = {...mockData}
    for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
        res[key] = newValue
    }

    const rules = Object.entries(res).map(([path, data], index) => ({
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
});


