import {ChangeEvent} from "react";
import {setItem} from "./setItem";

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