import {useEffect, useState} from "react";
import {useAtom} from 'jotai';
import {atomState} from "./store";
import {updateStorageContents} from './scripts/updateStorageContents'
import {setItem} from "./scripts/setItem";
import {getItem} from "./scripts/getItem";
import {removeItem} from "./scripts/removeItem";
import {clearAll} from "./scripts/clearAll";

const KEYS = ['isEnabled', 'endpoint', 'response']

const setStorage = (key: string, value: unknown) => {
    chrome.storage.local.set({[key]: value});
}

function App() {
    const [endpoint, setEndpoint] = useState('');
    const [response, setResponse] = useState('');
    const [state, setState] = useAtom(atomState);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(null, function (data) {
            if (data.endpoint) setEndpoint(data.endpoint);
            if (data.response) setResponse(data.response);
            setEnabled(data.isEnabled)
            updateStorageContents()
        });
    }, [setState]);

    const handleToggle = (checked: boolean) => {
        setEnabled(checked)
        setStorage('isEnabled', checked)
    }

    const handleEndpointChange = (value: string) => {
        setEndpoint(value)
        setStorage('endpoint', value)
    }

    const handleValueChange = (value: string) => {
        setResponse(value)
        setStorage('response', value)
    }

    const handleReset = () => {
        handleToggle(false)
        handleEndpointChange('')
        handleValueChange('')
    }

    const handleGetItem = () => {
        getItem(endpoint, setResponse)
    }

    const handleSetItem = () => {
        setItem(endpoint, response)
    }

    const handleRemoveItem = () => {
        removeItem(endpoint, () => {
            setEndpoint('')
            setResponse('')
        })
    }

    const handleClearAll = () => {
        clearAll()
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
                        id="endpoint"
                        type="text"
                        placeholder="Endpoint"
                        value={endpoint}
                        onChange={(e) => handleEndpointChange(e.target.value)}
                    />
                </li>

                <li>
                    <textarea
                        id="response"
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
                <div
                    id="endpoints">
                    {JSON.stringify(Object.fromEntries(Object.entries(state).filter(([key]) => !KEYS.includes(key))), null, 2)}
                </div>
                <span id="error" className=' text-red-700'></span>
            </div>

        </>
    )
}

export default App
