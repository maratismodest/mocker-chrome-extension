import {updateStorageContents} from "./updateStorageContents";
import {StoreType} from "../types";

export const setItem = (key: string, value: string, setState: (store: StoreType) => void) => {

    if (key && value) {
        chrome.storage.local.set({[key]: JSON.parse(value)}, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error setting item: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents(setState);
                alert('Item set successfully!');
            }
        });
    } else {
        alert('Please enter both key and value.');
    }
}