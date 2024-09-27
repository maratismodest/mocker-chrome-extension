export function updateStorageContents() {
    chrome.storage.local.get(null, function (items) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            document.getElementById('storage-contents').textContent = 'Error fetching storage contents';
        } else {
            document.getElementById('storage-contents').textContent = JSON.stringify(items, null, 2);
        }
    });
}