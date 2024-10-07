import {updateStorageContents} from "./updateStorageContents";

export const removeItem = (key: string, onSuccess: () => void) => {
    if (key) {
        chrome.storage.local.remove(key, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error removing item: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents();
                alert('Item removed successfully!');
                onSuccess()
            }
        });
    } else {
        alert('Please enter a key to remove.');
    }
}