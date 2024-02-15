chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "CDown" && !messageSent) { // Check if message has not been sent yet
        waitForCountdownContainer();
    }
});

function waitForCountdownContainer() {
    if (observer) return; // If observer already exists, return to avoid setting up another one

    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && document.querySelector('.timer')) {
                observer.disconnect(); // Disconnect the observer once the conditions are met

                // Only call injectModuleScript if messageSent is false
                if (!messageSent) {
                    injectModuleScript();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function injectModuleScript() {
    
    chrome.runtime.sendMessage({ type: "Done" });


    const countdownContainer = document.querySelector('.timer');
    if (!countdownContainer) {
        console.error("Countdown container not found");
        return;
    }

    // Set messageSent flag to true
    messageSent = true;

    // Select individual countdown items
    const countdownItems = countdownContainer.querySelectorAll('.item');

    // Initialize variables to store countdown values
    let days, hours, minutes, seconds;

    // Iterate over each countdown item to extract its value
    countdownItems.forEach((item, index) => {
        const valueElement = item.querySelector('.digits'); // Select the element containing the value
        const value = parseInt(valueElement.innerText.trim()); // Extract the integer value

        // Assign the value to the corresponding variable based on index
        switch(index) {
            case 0:
                days = value;
                break;
            case 1:
                hours = value;
                break;
            case 2:
                minutes = value;
                break;
            case 3:
                seconds = value;
                break;
            default:
                break;
        }
    });

    // Send countdown values along with the "countdownContainer" message
    chrome.runtime.sendMessage({
        type: "countdownContainer",
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    });
    
}
