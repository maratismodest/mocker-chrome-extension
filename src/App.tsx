import {useEffect, useState} from "react";
import {updateStorageContents} from './scripts/updateStorageContents'
import {setItem} from "./scripts/setItem";
import {getItem} from "./scripts/getItem";
import {removeItem} from "./scripts/removeItem";
import {clearAll} from "./scripts/clearAll";

function App() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            updateStorageContents();
        }
    }, [mounted]);

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
            <button onClick={setItem}>Set Item</button>
            <button onClick={getItem}>Get Item</button>
            <button onClick={removeItem}>Remove Item</button>
            <button onClick={clearAll}>Clear All</button>

            <h2>Endpoints:</h2>
            <div id="enpoints"></div>
        </>
    )
}

export default App
