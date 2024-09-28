function updateStorageContents() {
    if (document) {
        chrome.storage.local.get(null, function (items) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                document.getElementById('enpoints').textContent = 'Error fetching storage contents';
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error

                document.getElementById('enpoints').textContent = JSON.stringify(items, null, 2);
            }
        });
    }
}

function setItem() {
    if (document) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const key = document.getElementById('key')?.value;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const value = document.getElementById('value')?.value;
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

}

function App() {
    return (
        <>
            <h1>Mock Data Extension</h1>

            <ul>
                <li className="input-group">
                    <label htmlFor="key">Endpoint:</label>
                    <input type="text" id="key" placeholder="Enter endpoint"/>
                </li>

                <li className="input-group">
                    <label htmlFor="value">Response:</label>
                    <textarea id="value" placeholder="Enter json response" rows={5}/>
                </li>
            </ul>
            <button id="setItem" onClick={setItem}>Set Item</button>
            <button id="getItem">Get Item</button>
            <button id="removeItem">Remove Item</button>
            <button id="clearAll">Clear All</button>

            <h2>Endpoints:</h2>
            <div id="enpoints">111</div>
        </>
    )
}

export default App
