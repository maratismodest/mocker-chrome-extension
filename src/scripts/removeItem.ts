import {updateStorageContents} from "./updateStorageContents.js";

export const removeItem = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const key = document.getElementById('key').value;
    if (key) {
        chrome.storage.local.remove(key, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error removing item: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents();
                alert('Item removed successfully!');
            }
        });
    } else {
        alert('Please enter a key to remove.');
    }
}