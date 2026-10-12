import {ChangeEvent, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {useAtom} from 'jotai'
import {
    clearAll,
    getEndpoints,
    getItem,
    handleExport,
    handleFileUpload,
    removeItem,
    setItem,
} from "./helpers";
import type {HttpMethod} from "./store";
import {endpointAtom, methodAtom, responseAtom} from "./store";
import {HTTP_METHODS} from "./constants";

type Message = { type: 'success' | 'error', text: string };

function App() {
    const [method, setMethod] = useAtom(methodAtom);
    const [endpoint, setEndpoint] = useAtom(endpointAtom);
    const [response, setResponse] = useAtom(responseAtom);
    const [enabled, setEnabled] = useState(false);
    const [endpoints, setEndpoints] = useState<Record<string, unknown>>({});
    const [message, setMessage] = useState<Message | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null)

    // Storage is the single source of truth: re-read it on every change,
    // so the list and the toggle stay in sync (e.g. after Clear All or import).
    useEffect(() => {
        const sync = async () => {
            const {isEnabled} = await chrome.storage.local.get('isEnabled');
            setEnabled(isEnabled === true);
            setEndpoints(await getEndpoints());
        };
        sync().catch(() => setMessage({type: 'error', text: 'Error fetching storage contents'}));
        chrome.storage.onChanged.addListener(sync);
        return () => chrome.storage.onChanged.removeListener(sync);
    }, []);

    const run = async (action: () => Promise<string | void>) => {
        try {
            const text = await action();
            setMessage(text ? {type: 'success', text} : null);
        } catch (error) {
            setMessage({type: 'error', text: error instanceof Error ? error.message : String(error)});
        }
    }

    const handleToggle = (checked: boolean) => run(async () => {
        await chrome.storage.local.set({isEnabled: checked});
    })

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
        setMessage(null)
    }

    const handleGetItem = () => run(async () => {
        setResponse(await getItem(method, endpoint));
    });

    const handleSetItem = () => run(() => setItem(method, endpoint, response));

    const handleRemoveItem = () => run(async () => {
        const text = await removeItem(method, endpoint);
        handleEndpointChange('')
        handleResponseChange('')
        return text;
    })

    const handleExportClick = () => run(async () => {
        handleExport(await getEndpoints());
    })

    const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (file) run(() => handleFileUpload(file));
    }

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all items from storage?')) {
            run(clearAll);
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
                    onClick={handleExportClick}
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
                    onChange={handleImport}
                    className="mb-4 p-2 border border-gray-300 rounded-sm"
                />
                <button onClick={handleClearAll} className='bg-red-500 hover:bg-red-700 ml-auto'>Clear All</button>
            </div>

            {message && (
                <p role={message.type === 'error' ? 'alert' : 'status'}
                   className={clsx('mt-2 text-sm', message.type === 'error' ? 'text-red-700' : 'text-green-700')}>
                    {message.text}
                </p>
            )}

            <div className='mt-4'>
                <h2>Endpoints:</h2>
                <div id="endpoints">{JSON.stringify(endpoints, null, 2)}</div>
            </div>

        </>
    )
}

export default App
