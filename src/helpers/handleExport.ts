export const handleExport = (jsonData: unknown) => {
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