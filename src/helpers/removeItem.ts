import {updateStorageContents} from "./updateStorageContents";
import type {HttpMethod} from "../store";

const getStorageKey = (method: HttpMethod, endpoint: string) => `${method}:${endpoint}`;

export const removeItem = (method: HttpMethod, endpoint: string) => {
    const key = getStorageKey(method, endpoint);
    if (endpoint) {
        chrome.storage.local.remove(key, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error removing item: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents();
                alert('Item removed successfully!');
            }
        });
    } else {
        alert('Please enter a key to remove.');
    }
}