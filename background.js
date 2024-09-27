const mockData = {
    '/api/users': [
        {"id": 1, "name": "John Doe"},
        {"id": 2, "name": "Jane Smith"},
        {"id": 3, "name": "Jane Smith"}
    ],
    '/api/products': [
        {"id": 1, "name": "Widget", "price": 9.99},
        {"id": 2, "name": "Gadget", "price": 19.99}
    ],
    // '/personalized-coaching/pending-report-count': {
    //     "count": 99
    // }
};

function updateStorageContents() {
    chrome.storage.local.get(null, function (items) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            document.getElementById('storage-contents').textContent = 'Error fetching storage contents';
        } else {
            document.getElementById('storage-contents').textContent = JSON.stringify(items, null, 2);
        }
    });
}


chrome.runtime.onInstalled.addListener(() => {

    // for (let [key, {oldValue, newValue}] of Object.entries(chrome.storage.local.get())) {
    //     console.log(
    //         `Storage key "${key}" in namespace "${namespace}" changed.`,
    //         `Old value was "${oldValue}", new value is "${newValue}".`
    //     );
    //     res[key] = newValue
    // }
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

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(rule => rule.id),
        addRules: rules
    });
});


