export const updateStorageContents = () => {

    chrome.storage.local.get(null, function (items) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            document.getElementById('enpoints').textContent = 'Error fetching storage contents';
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // document.getElementById('enpoints').textContent = JSON.stringify(items, null, 2);
            document.getElementById('enpoints').textContent = JSON.stringify(items, null, 2);
        }
    });
}