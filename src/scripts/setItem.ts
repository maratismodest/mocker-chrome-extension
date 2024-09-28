import {updateStorageContents} from "./updateStorageContents";

export const setItem = () => {

    const key = document.getElementById('key') as HTMLInputElement
    const value = document.getElementById('value') as HTMLTextAreaElement
    if (key.value && value.value) {
        chrome.storage.local.set({[key.value]: JSON.parse(value.value)}, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error setting item: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents();
                alert('Item set successfully!');
            }
        });
    } else {
        alert('Please enter both key and value.');
    }
}