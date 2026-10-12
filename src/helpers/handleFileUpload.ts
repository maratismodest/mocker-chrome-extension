import {getStorageKey, parseStorageKey} from "./storageKey";

export const handleFileUpload = async (file: File) => {
    let json: unknown;
    try {
        json = JSON.parse(await file.text());
    } catch {
        throw new Error('Error parsing JSON file. Please make sure it\'s a valid JSON.');
    }
    if (!json || typeof json !== 'object' || Array.isArray(json)) {
        throw new Error('JSON file must contain an object of endpoints.');
    }

    const items = Object.fromEntries(Object.entries(json).map(([key, value]) => {
        const parsed = parseStorageKey(key);
        return [parsed ? key : getStorageKey('GET', key), value];
    }));
    // One write instead of one per endpoint, so the background rules are rebuilt once
    await chrome.storage.local.set(items);
    return `Imported ${Object.keys(items).length} endpoints.`;
};
