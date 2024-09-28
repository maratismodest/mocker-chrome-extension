export const updateStorageContents = () => {

    chrome.storage.local.get(null, function (items) {
        const enpoints = document.getElementById('enpoints');
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            if (enpoints) {
                enpoints.textContent = 'Error fetching storage contents';
            }
        } else {
            if (enpoints) {
                enpoints.textContent = JSON.stringify(items, null, 2)
            }
        }
    });
}