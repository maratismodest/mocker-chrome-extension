import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useAtom} from 'jotai'
import {atomWithStorage} from 'jotai/utils'
import {setItem, getItem, removeItem, updateStorageContents, clearAll, setStorage} from "./scripts";

const endpointAtom = atomWithStorage<string>('endpoint', '')
const responseAtom = atomWithStorage<string>('response', '')

const handleExport = (jsonData: unknown) => {
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], {type: 'application/json'});

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mock-data-extension.json';
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

function App() {
    const [endpoint, setEndpoint] = useAtom(endpointAtom);
    const [response, setResponse] = useAtom(responseAtom);
    const [enabled, setEnabled] = useState(false);

    const ref = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        chrome.storage.local.get(null, function (data) {
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
    }

    const handleResponseChange = (value: string) => {
        setResponse(value)
    }

    const handleReset = () => {
        handleToggle(false)
        handleEndpointChange('')
        handleResponseChange('')
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

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    const json = JSON.parse(result);
                    Object.entries(json).forEach(([key, value]) => {
                        setItem(key, JSON.stringify(value));
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Error parsing JSON file. Please make sure it\'s a valid JSON.');
            }
        };

        reader.readAsText(file);
    };

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
                        onChange={(e) => handleResponseChange(e.target.value)}
                    />
                </li>
            </ul>
            <div className='flex gap-1 flex-wrap relative mt-2'>
                <button onClick={handleSetItem}>Set Item</button>
                <button onClick={handleGetItem}>Get Item</button>
                <button onClick={handleRemoveItem}>Remove Item</button>
                <button onClick={handleClearAll}>Clear All</button>
                <button onClick={handleReset} className='bg-orange-500'>Reset</button>
            </div>

            <div className='flex gap-1 flex-wrap relative mt-2'>
                <button
                    onClick={() => ref.current && handleExport(JSON.parse(ref.current.innerHTML))}
                    className="bg-blue-500 hover:bg-blue-700 text-white rounded"
                >
                    Export JSON
                </button>
                <button
                    onClick={() => inputRef.current && inputRef.current.click()}
                    className="bg-red-500 hover:bg-red-700 text-white rounded"
                >
                    Import JSON
                </button>
                <input
                    hidden
                    ref={inputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
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
