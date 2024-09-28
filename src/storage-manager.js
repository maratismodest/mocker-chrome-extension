import {updateStorageContents} from "./scripts/updateStorageContents";
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

});

