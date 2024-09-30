import {updateStorageContents} from "./updateStorageContents";

export const setItem = (endpoint: string, response: string) => {

    if (endpoint && response) {
        chrome.storage.local.set({[endpoint]: JSON.parse(response)}, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error setting item: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents();
                alert('Item set successfully!');
            }
        });
    } else {
        alert('Please enter both endpoint and response.');
    }
}