export const updateStorageContents = () => {

    chrome.storage.local.get(null, function (items) {
        const endpoints = document.getElementById('endpoints');
        const error = document.getElementById('error');
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            if (error) {
                error.textContent = 'Error fetching storage contents';
            }
        } else {
            if (endpoints) {
                endpoints.textContent = JSON.stringify(items, null, 2);
            }
        }
    });
}