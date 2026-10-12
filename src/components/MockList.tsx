import clsx from "clsx";
import type {HttpMethod} from "../store";
import {parseStorageKey} from "../helpers";

const METHOD_COLORS: Record<HttpMethod, string> = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-amber-100 text-amber-800',
    DELETE: 'bg-red-100 text-red-800',
};

type Props = {
    mocks: Record<string, unknown>;
    disabled: string[];
    mockingEnabled: boolean;
    editingKey: string | null;
    onToggle: (key: string, enabled: boolean) => void;
    onEdit: (key: string) => void;
    onDelete: (key: string) => void;
};

export function MockList({mocks, disabled, mockingEnabled, editingKey, onToggle, onEdit, onDelete}: Props) {
    const rows = Object.keys(mocks)
        .map(key => ({key, ...(parseStorageKey(key) ?? {method: 'GET' as HttpMethod, endpoint: key})}))
        .sort((a, b) => a.endpoint.localeCompare(b.endpoint) || a.method.localeCompare(b.method));

    return (
        <div className='mt-4'>
            <h2>Mocks ({rows.length})</h2>
            {!mockingEnabled && rows.length > 0 && (
                <p className='text-sm text-gray-500 mb-2'>API mocking is off — no mocks are applied.</p>
            )}
            {rows.length === 0 ? (
                <p className='text-sm text-gray-500'>No mocks yet. Add one above or import a file.</p>
            ) : (
                <ul id="endpoints" className={clsx(!mockingEnabled && 'opacity-60')}>
                    {rows.map(({key, method, endpoint}) => {
                        const isOn = !disabled.includes(key);
                        return (
                            <li key={key}
                                className={clsx('flex items-center gap-2 px-2 py-1 rounded-sm',
                                    key === editingKey && 'bg-yellow-50', !isOn && 'text-gray-400')}>
                                <input type="checkbox" checked={isOn} aria-label={`Enable ${method} ${endpoint}`}
                                       onChange={(e) => onToggle(key, e.target.checked)}/>
                                <span className={clsx('w-16 shrink-0 text-center text-xs font-mono font-semibold rounded-sm py-0.5',
                                    isOn ? METHOD_COLORS[method] : 'bg-gray-100 text-gray-400')}>
                                    {method}
                                </span>
                                <span className='flex-1 truncate font-mono text-sm'
                                      title={JSON.stringify(mocks[key]).slice(0, 300)}>
                                    {endpoint}
                                </span>
                                <button onClick={() => onEdit(key)} className='mock-action'>Edit</button>
                                <button onClick={() => onDelete(key)} className='mock-action hover:text-red-700'>Delete</button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
