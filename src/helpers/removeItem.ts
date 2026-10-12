import type {HttpMethod} from "../store";
import {getStorageKey} from "./storageKey";

export const removeItem = async (method: HttpMethod, endpoint: string) => {
    if (!endpoint) {
        throw new Error('Please enter an endpoint to remove.');
    }
    await chrome.storage.local.remove(getStorageKey(method, endpoint));
    return 'Item removed successfully!';
}
