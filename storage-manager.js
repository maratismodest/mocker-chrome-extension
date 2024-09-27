// storage-manager.js
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


function setItem() {
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

function getItem() {
    const key = document.getElementById('key').value;
    if (key) {
        chrome.storage.local.get(key, function (result) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error getting item: ' + chrome.runtime.lastError.message);
            } else {
                const value = result[key];
                document.getElementById('value').value = value || '';
                alert(value ? `Value: ${value}` : 'Key not found');
            }
        });
    } else {
        alert('Please enter a key to get.');
    }
}

function removeItem() {
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

function clearAll() {
    if (confirm('Are you sure you want to clear all items from storage?')) {
        chrome.storage.local.clear(function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error clearing storage: ' + chrome.runtime.lastError.message);
            } else {
                updateStorageContents();
                alert('All items cleared from storage.');
            }
        });
    }
}

function updateStorageContents() {
    chrome.storage.local.get(null, function (items) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            document.getElementById('storage-contents').textContent = 'Error fetching storage contents';
        } else {
            console.warn('items', items)
            document.getElementById('storage-contents').textContent = JSON.stringify(items, null, 2);
        }
    });
}