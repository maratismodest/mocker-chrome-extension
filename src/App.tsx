import {useEffect, useState} from "react";
import {useAtom} from 'jotai';
import {atomState} from "./store";
import {updateStorageContents} from './scripts/updateStorageContents'
import {setItem} from "./scripts/setItem";
import {getItem} from "./scripts/getItem";
import {removeItem} from "./scripts/removeItem";
import {clearAll} from "./scripts/clearAll";
import {onToggle} from "./scripts/onToggle";

function App() {
    const [endpoint, setEndpoint] = useState('');
    const [response, setResponse] = useState('');
    const [state, setState] = useAtom(atomState);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(['isEnabled', 'endpoint', 'response'], function (data) {
            if (data.endpoint) setEndpoint(data.endpoint);
            if (data.response) setResponse(data.response);
            setEnabled(data.isEnabled)
        });
    }, []);

    useEffect(() => {
        if (chrome?.storage?.local) {
            updateStorageContents(setState)
        }
    }, [chrome?.storage?.local]);

    const handleToggle = (checked: boolean) => {
        setEnabled(checked)
        onToggle(checked)
    }

    const handleKeyChange = (value: string) => {
        setEndpoint(value)
        chrome.storage.local.set({key: value});
    }

    const handleValueChange = (value: string) => {
        setResponse(value)
        chrome.storage.local.set({value: value});
    }

    const handleReset = () => {
        handleToggle(false)
        handleKeyChange('')
        handleValueChange('')
    }

    const handleGetItem = () => {
        getItem(endpoint, setResponse)
    }

    const handleSetItem = () => {
        setItem(endpoint, response, setState)
    }

    const handleRemoveItem = () => {
        removeItem(endpoint, () => {
            setEndpoint('')
            setResponse('')
        }, setState)
    }

    const handleClearAll = () => {
        clearAll(setState)
    }

    return (
        <>
            <h1 className='text-2xl'>Mock Data Extension</h1>
            <ul className='grid grid-cols-1 gap-2'>
                <li className='flex items-center gap-2'>
                    <label htmlFor="enable">Enable API Mocking</label>
                    <input
                        type="checkbox"
                        id='enable'
                        checked={enabled}
                        onChange={(event) => handleToggle(event.target.checked)}
                    />
                </li>
                <li>
                    <input
                        id="key"
                        type="text"
                        placeholder="Endpoint"
                        value={endpoint}
                        onChange={(e) => handleKeyChange(e.target.value)}
                    />
                </li>

                <li>
                    <textarea
                        id="value"
                        placeholder="Response"
                        rows={5}
                        value={response}
                        onChange={(e) => handleValueChange(e.target.value)}
                    />
                </li>
            </ul>
            <div className='flex gap-1 flex-wrap relative mt-2'>
                <button onClick={handleSetItem}>Set Item</button>
                <button onClick={handleGetItem}>Get Item</button>
                <button onClick={handleRemoveItem}>Remove Item</button>
                <button onClick={handleClearAll}>Clear All</button>
                <button onClick={handleReset}>Reset</button>
            </div>

            <div className='mt-4'>
                <h2>Endpoints:</h2>
                <div id="endpoints">{JSON.stringify(state, null, 2)}</div>
                <span id="error" className=' text-red-700'></span>
            </div>

        </>
    )
}

export default App
