export const clearAll = async () => {
    await chrome.storage.local.clear();
    return 'All items cleared from storage.';
}
