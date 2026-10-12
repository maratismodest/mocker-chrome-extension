import {DISABLED_KEY} from "./storageKey";

export const getDisabledMocks = async (): Promise<string[]> => {
    const {[DISABLED_KEY]: disabled} = await chrome.storage.local.get(DISABLED_KEY);
    return Array.isArray(disabled) ? disabled : [];
};

export const setMockEnabled = async (key: string, enabled: boolean) => {
    const disabled = (await getDisabledMocks()).filter(k => k !== key);
    if (!enabled) disabled.push(key);
    await chrome.storage.local.set({[DISABLED_KEY]: disabled});
};
