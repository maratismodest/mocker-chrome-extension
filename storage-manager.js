import {updateStorageContents} from "./scripts/updateStorageContents.js";
import {getItem} from "./scripts/getItem.js";
import {setItem} from "./scripts/setItem.js";
import {removeItem} from "./scripts/removeItem.js";
import {clearAll} from "./scripts/clearAll.js";

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('setItem').addEventListener('click', setItem);
    document.getElementById('getItem').addEventListener('click', getItem);
    document.getElementById('removeItem').addEventListener('click', removeItem);
    document.getElementById('clearAll').addEventListener('click', clearAll);

    // Initial update of storage contents
    updateStorageContents();

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
            console.log(
                `Storage key "${key}" in namespace "${namespace}" changed.`,
                `Old value was "${oldValue}", new value is "${newValue}".`
            );
        }
    });

});

