// Add listener for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Reload") {
        injectReloadIScript();
        console.log('inject will start');
    }
});

// Function to extract time and date from the given element
function extractTimeAndDate() {
    const element = document.querySelector('span.svelte-1d6bfct span.chromatic-ignore');
    if (element) {
        const dateTimeString = element.innerText.trim();
        const [time, date] = dateTimeString.split(' ');
        return { time, date };
    }
    return null;
}

// Fetch time and date and send message to background script
function fetchTimeAndDateAndSendMessage() {
    const timeAndDate = extractTimeAndDate();
    if (timeAndDate) {
        chrome.runtime.sendMessage({ type: 'timeAndDate', data: timeAndDate });
    }
}

// Function to periodically check for the existence of the element
function injectReloadIScript() {
    const maxAttempts = 100;
    let attempts = 0;

    const checkExist = setInterval(() => {
        const timeAndDate = extractTimeAndDate();
        if (timeAndDate) {
            clearInterval(checkExist);
            fetchTimeAndDateAndSendMessage();
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(checkExist);
                console.error('Element not found after maximum attempts');
            }
        }
    }, 100);

    const buttonTimeout = setTimeout(() => {
        clearInterval(checkExist);
        window.close();
    }, 40000); 
}
