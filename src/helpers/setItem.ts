import {updateStorageContents} from "./updateStorageContents";
import type {HttpMethod} from "../store";

const getStorageKey = (method: HttpMethod, endpoint: string) => `${method}:${endpoint}`;

export const setItem = (method: HttpMethod, endpoint: string, response: string) => {
    if (endpoint && response) {
        const key = getStorageKey(method, endpoint);
        chrome.storage.local.set({[key]: JSON.parse(response)}, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error setting item: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents();
                alert('Item set successfully!');
            }
        });
    } else {
        alert('Please enter both endpoint and response.');
    }
}