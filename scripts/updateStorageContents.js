export function updateStorageContents() {
    chrome.storage.local.get(null, function (items) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            document.getElementById('enpoints').textContent = 'Error fetching storage contents';
        } else {
            document.getElementById('enpoints').textContent = JSON.stringify(items, null, 2);
        }
    });
}