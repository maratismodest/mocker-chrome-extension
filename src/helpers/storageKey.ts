import type {HttpMethod} from "../store";
import {HTTP_METHODS} from "../constants";

export const DISABLED_KEY = 'disabledMocks';
export const SERVICE_KEYS = ['isEnabled', DISABLED_KEY];

export const getStorageKey = (method: HttpMethod, endpoint: string) => `${method}:${endpoint}`;

export const parseStorageKey = (key: string): { method: HttpMethod; endpoint: string } | null => {
    for (const m of HTTP_METHODS) {
        if (key.startsWith(`${m}:`)) {
            return {method: m, endpoint: key.slice(m.length + 1)};
        }
    }
    return null;
};

export const getEndpoints = async (): Promise<Record<string, unknown>> => {
    const items = await chrome.storage.local.get(null);
    return Object.fromEntries(Object.entries(items).filter(([key]) => !SERVICE_KEYS.includes(key)));
};
