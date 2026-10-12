import type {HttpMethod} from "../store";
import {getStorageKey} from "./storageKey";

export const getItem = async (method: HttpMethod, endpoint: string) => {
    if (!endpoint) {
        throw new Error('Please enter an endpoint to get.');
    }
    const key = getStorageKey(method, endpoint);
    const result = await chrome.storage.local.get(key);
    if (!(key in result)) {
        throw new Error('Key not found.');
    }
    return JSON.stringify(result[key], null, 2);
}
