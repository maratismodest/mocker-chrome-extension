import {updateStorageContents} from "./updateStorageContents.js";

export function setItem() {
    const key = document.getElementById('key').value;
    const value = document.getElementById('value').value;
    if (key && value) {
        chrome.storage.local.set({[key]: JSON.parse(value)}, function () {
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