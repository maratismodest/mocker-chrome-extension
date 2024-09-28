import {updateStorageContents} from "./updateStorageContents.js";

export const clearAll = () => {
    if (confirm('Are you sure you want to clear all items from storage?')) {
        chrome.storage.local.clear(function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error clearing storage: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents();
                alert('All items cleared from storage.');
            }
        });
    }
}