export const onToggle = (checked:boolean) => {
    chrome.storage.local.set({isEnabled: checked}, function () {
        console.log('Extension is now ' + (checked ? 'enabled' : 'disabled'));
    });
}