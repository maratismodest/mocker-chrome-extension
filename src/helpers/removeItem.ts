import {DISABLED_KEY} from "./storageKey";
import {getDisabledMocks} from "./toggleMock";

export const removeItem = async (key: string) => {
    const disabled = await getDisabledMocks();
    await chrome.storage.local.remove(key);
    if (disabled.includes(key)) {
        await chrome.storage.local.set({[DISABLED_KEY]: disabled.filter(k => k !== key)});
    }
    return 'Mock removed.';
}
