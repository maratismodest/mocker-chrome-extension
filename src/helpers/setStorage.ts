export const setStorage = (key: string, value: unknown) => {
    chrome.storage.local.set({[key]: value});
}
