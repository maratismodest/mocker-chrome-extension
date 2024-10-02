import {useEffect, useState} from "react";
import {updateStorageContents} from './scripts/updateStorageContents'
import {setItem} from "./scripts/setItem";
import {getItem} from "./scripts/getItem";
import {removeItem} from "./scripts/removeItem";
import {clearAll} from "./scripts/clearAll";

const setStorage = (key: string, value: unknown) => {
    chrome.storage.local.set({[key]: value});
}

function App() {
    const [endpoint, setEndpoint] = useState('');
    const [response, setResponse] = useState('');
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(null, function (data) {
            if (data.endpoint) setEndpoint(data.endpoint);
            if (data.response) setResponse(data.response);
            setEnabled(data.isEnabled)
            updateStorageContents()
        });
    }, []);

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
            <ul className='grid grid-cols-1 gap-3'>
                <li className='flex items-center gap-2'>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={enabled} className="sr-only peer"
                               onChange={(event) => handleToggle(event.target.checked)}/>
                        <div
                            className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span
                            className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable API Mocking</span>
                    </label>
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
                <button onClick={handleReset} className='bg-transparent'>Reset</button>
            </div>

            <div className='mt-4'>
                <h2>Endpoints:</h2>
                <div
                    id="endpoints">
                </div>
                <span id="error" className=' text-red-700'></span>
            </div>

        </>
    )
}

export default App
