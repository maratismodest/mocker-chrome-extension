import {ChangeEvent} from "react";
import {setItem} from "./setItem";
import type {HttpMethod} from "../store";

const parseStorageKey = (key: string): { method: HttpMethod; endpoint: string } | null => {
    const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE'];
    for (const m of methods) {
        if (key.startsWith(`${m}:`)) {
            return { method: m, endpoint: key.slice(m.length + 1) };
        }
    }
    return null;
};

export const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
            const result = e.target?.result;
            if (typeof result === 'string') {
                const json = JSON.parse(result);
                Object.entries(json).forEach(([key, value]) => {
                    const parsed = parseStorageKey(key);
                    if (parsed) {
                        setItem(parsed.method, parsed.endpoint, JSON.stringify(value));
                    } else {
                        setItem('GET', key, JSON.stringify(value));
                    }
                });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Error parsing JSON file. Please make sure it\'s a valid JSON.');
        }
    };

    reader.readAsText(file);
};