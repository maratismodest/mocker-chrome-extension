import {useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {useAtom} from 'jotai'
import {
    clearAll,
    getItem,
    handleExport,
    handleFileUpload,
    removeItem,
    setItem,
    setStorage,
    updateStorageContents,
} from "./helpers";
import type {HttpMethod} from "./store";
import {endpointAtom, methodAtom, responseAtom} from "./store";
import {HTTP_METHODS} from "./constants";


function App() {
    const [method, setMethod] = useAtom(methodAtom);
    const [endpoint, setEndpoint] = useAtom(endpointAtom);
    const [response, setResponse] = useAtom(responseAtom);
    const [enabled, setEnabled] = useState(false);

    const ref = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        chrome.storage.local.get(null, function (data) {
            setEnabled(typeof data.isEnabled === "boolean" ? data.isEnabled : false);
            updateStorageContents()
        });
    }, []);

    const handleToggle = (checked: boolean) => {
        setEnabled(checked)
        setStorage('isEnabled', checked)
    }

    const handleMethodChange = (value: HttpMethod) => {
        setMethod(value);
    };

    const handleEndpointChange = (value: string) => {
        setEndpoint(value);
    }

    const handleResponseChange = (value: string) => {
        setResponse(value)
    }

    const handleReset = () => {
        handleEndpointChange('')
        handleResponseChange('')
    }

    const handleGetItem = () => {
        getItem(method, endpoint, setResponse);
    };

    const handleSetItem = () => {
        setItem(method, endpoint, response);
    };

    const handleRemoveItem = () => {
        removeItem(method, endpoint);
        handleReset();
    }

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all data?')) {
            clearAll()
        }
    }

    const buttons = [
        {label: 'Set Item', onClick: handleSetItem},
        {label: 'Get Item', onClick: handleGetItem},
        {label: 'Remove Item', onClick: handleRemoveItem},
        {label: 'Reset Form', onClick: handleReset},
    ]


    return (
        <>
            <h1 className='text-xl'>Mock Data Extension</h1>
            <ul className='grid grid-cols-1 gap-3'>
                <li className='form-input-group'>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={enabled} className="sr-only peer"
                               onChange={(event) => handleToggle(event.target.checked)}/>
                        <div
                            className="relative w-11 h-6 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:inset-s-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span
                            className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable API Mocking</span>
                    </label>
                </li>

                <li className="form-input-group">

                    <select
                        id="method"
                        value={method}
                        onChange={(e) => handleMethodChange(e.target.value as HttpMethod)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                        {HTTP_METHODS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <input
                        className='flex-1'
                        id="endpoint"
                        type="text"
                        placeholder="Endpoint"
                        value={endpoint}
                        onChange={(e) => handleEndpointChange(e.target.value)}
                    />

                </li>

                <li className='form-input-group'>
                    <textarea
                        id="response"
                        placeholder="Response"
                        rows={5}
                        value={response}
                        onChange={(e) => handleResponseChange(e.target.value)}
                    />
                </li>
            </ul>
            <ul className='flex gap-1 relative mt-2 justify-between'>
                {buttons.map((button) => (
                    <li key={button.label}>
                        <button
                            key={button.label}
                            onClick={button.onClick}
                            className="bg-green-500 hover:bg-green-700 text-white rounded-sm px-4"
                        >
                            {button.label}
                        </button>
                    </li>
                ))}

            </ul>
            <div className='flex gap-1 flex-wrap relative mt-2'>
                <button
                    onClick={() => ref.current && handleExport(JSON.parse(ref.current.innerHTML))}
                    className={clsx("bg-blue-500 hover:bg-blue-700", "text-white rounded-sm px-4")}
                >
                    Export
                </button>
                <button
                    onClick={() => inputRef.current && inputRef.current.click()}
                    className={clsx("bg-orange-400 hover:bg-orange-600", "text-white rounded-sm px-4")}
                >
                    Import
                </button>
                <input
                    hidden
                    ref={inputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="mb-4 p-2 border border-gray-300 rounded-sm"
                />
                <button onClick={handleClearAll} className='bg-red-500 hover:bg-red-700 ml-auto'>Clear All</button>
            </div>

            <div className='mt-4'>
                <h2>Endpoints:</h2>
                <div id="endpoints" ref={ref}/>
                <span id="error" className='text-red-700'></span>
            </div>

        </>
    )
}

export default App
