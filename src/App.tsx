import {useEffect, useState} from "react";
import {updateStorageContents} from './scripts/updateStorageContents'
import {setItem} from "./scripts/setItem";
import {getItem} from "./scripts/getItem";
import {removeItem} from "./scripts/removeItem";
import {clearAll} from "./scripts/clearAll";

function App() {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    useEffect(() => {
        if (chrome?.storage?.local) {
            updateStorageContents()
        }
    }, [chrome?.storage?.local]);

    return (
        <>
            <h1>Mock Data Extension</h1>

            <ul>
                <li className="input-group">
                    <label htmlFor="key">Endpoint:</label>
                    <input id="key"
                           type="text"
                           placeholder="Enter endpoint"
                           value={key}
                           onChange={(e) => setKey(e.target.value)}
                    />
                </li>

                <li className="input-group">
                    <label htmlFor="value">Response:</label>
                    <textarea id="value" placeholder="Enter json response" rows={5} value={value}
                              onChange={(e) => setValue(e.target.value)}/>
                </li>
            </ul>
            <div className='buttons'>
                <button onClick={setItem}>Set Item</button>
                <button onClick={() => getItem(key, setValue)}>Get Item</button>
                <button onClick={removeItem}>Remove Item</button>
                <button onClick={clearAll}>Clear All</button>
            </div>

            <h2>Endpoints:</h2>
            <div id="enpoints"></div>
        </>
    )
}

export default App
