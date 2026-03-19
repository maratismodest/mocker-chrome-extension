import type {HttpMethod} from "../store";

const getStorageKey = (method: HttpMethod, endpoint: string) => `${method}:${endpoint}`;

export const getItem = (method: HttpMethod, endpoint: string, setResponse: (value: string) => void) => {
    if (endpoint) {
        const key = getStorageKey(method, endpoint);
        chrome.storage.local.get(key, function (result) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error getting item: ' + chrome.runtime.lastError.message);
            } else {
                const value = result[key];
                setResponse(JSON.stringify(value) || '');
                alert(value ? `Value: ${JSON.stringify(value)}` : 'Key not found');
            }
        });
    } else {
        alert('Please enter a key to get.');
    }
}