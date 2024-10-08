import {updateStorageContents} from "./updateStorageContents";

export const removeItem = (key: string) => {
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