import type {HttpMethod} from "../store";
import {getStorageKey} from "./storageKey";

export const setItem = async (method: HttpMethod, endpoint: string, response: string) => {
    if (!endpoint || !response) {
        throw new Error('Please enter both endpoint and response.');
    }
    let parsed: unknown;
    try {
        parsed = JSON.parse(response);
    } catch {
        throw new Error('Response is not valid JSON.');
    }
    await chrome.storage.local.set({[getStorageKey(method, endpoint)]: parsed});
    return 'Item set successfully!';
}
