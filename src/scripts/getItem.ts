export const getItem = (key: string, setValue: (value: string) => void) => {
    if (key) {
        chrome.storage.local.get(key, function (result) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error getting item: ' + chrome.runtime.lastError.message);
            } else {
                const value = result[key];
                setValue(JSON.stringify(value) || '')
                alert(value ? `Value: ${JSON.stringify(value)}` : 'Key not found');
            }
        });
    } else {
        alert('Please enter a key to get.');
    }
}