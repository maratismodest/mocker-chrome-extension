import {StoreType} from "../types";

export const updateStorageContents = (setState: (items: StoreType) => void) => {

    chrome.storage.local.get(null, function (items) {
        const endpoints = document.getElementById('endpoints');
        const error = document.getElementById('error');
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            if (error) {
                error.textContent = 'Error fetching storage contents';
            }
        } else {
            if (endpoints) {
                setState(items)
            }
        }
    });
}