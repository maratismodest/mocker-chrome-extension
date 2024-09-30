export const getItem = (endpoint: string, setResponse: (value: string) => void) => {
    if (endpoint) {
        chrome.storage.local.get(endpoint, function (result) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                alert('Error getting item: ' + chrome.runtime.lastError.message);
            } else {
                const value = result[endpoint];
                setResponse(JSON.stringify(value) || '')
                alert(value ? `Value: ${JSON.stringify(value)}` : 'Key not found');
            }
        });
    } else {
        alert('Please enter a key to get.');
    }
}