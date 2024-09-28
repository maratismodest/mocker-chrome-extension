export function getItem() {
    const key = document.getElementById('key').value;
    if (key) {
        chrome.storage.local.get(key, function (result) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error getting item: ' + chrome.runtime.lastError.message);
            } else {
                const value = result[key];
                document.getElementById('value').value = JSON.stringify(value) || '';
                alert(value ? `Value: ${JSON.stringify(value)}` : 'Key not found');
            }
        });
    } else {
        alert('Please enter a key to get.');
    }
}