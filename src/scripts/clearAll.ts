import {updateStorageContents} from "./updateStorageContents";
import {StoreType} from "../types";

export const clearAll = (setState: (store: StoreType) => void) => {
    if (confirm('Are you sure you want to clear all items from storage?')) {
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error clearing storage: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents(setState);
                alert('All items cleared from storage.');
            }
        });
    }
}