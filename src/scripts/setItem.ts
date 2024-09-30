import {updateStorageContents} from "./updateStorageContents";
import {StoreType} from "../types";

export const setItem = (endpoint: string, response: string, setState: (store: StoreType) => void) => {

    if (endpoint && response) {
        chrome.storage.local.set({[endpoint]: JSON.parse(response)}, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error setting item: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents(setState);
                alert('Item set successfully!');
            }
        });
    } else {
        alert('Please enter both endpoint and response.');
    }
}