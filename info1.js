chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Info2") {
        setTimeout(() => {
            injectInfo2Script();
        }, 100);
    }
});

function injectInfo2Script() {

    // Define a variable to hold the interval ID
    let intervalId;

    // Start the interval to check for the button element
    intervalId = setInterval(function() {
        // Find the button element
        const button = document.querySelector('.sidebar-item-wrapper[data-analytics="sidebar-raffle-button"]');
        
        // Check if the button element is found
        if (button) {
            // Stop the interval
            clearInterval(intervalId);
            
            // Simulate a click on the button
            button.click();
            setTimeout(() => {
                injectInfo3Script();
            }, 100);
        }
    }, 50);
}


function injectInfo3Script() {
    chrome.runtime.sendMessage({ type: "Done" });
    
    function sendTicketDataToBackground(ticket) {
        chrome.runtime.sendMessage({ type: "UserInfo1", data: ticket });
    }
    
    function extractAndSendUserTicketInfo() {
        const ticketElements = document.querySelectorAll('.weight-semibold.line-height-default.inline.align-center.size-default.text-size-default.variant-highlighted.with-icon-space.svelte-1d6bfct');
        if (ticketElements.length > 0) {
            ticketElements.forEach(ticketElement => {
                const ticket = ticketElement.textContent.trim();
                sendTicketDataToBackground(ticket);
                setTimeout(() => {
                    clearInterval(intervalId);
                    window.close();
                }, 100);
            });
        } 
    }

    // Check for ticket elements every 250 milliseconds
    const intervalId = setInterval(() => {
        extractAndSendUserTicketInfo();
    }, 150);

    // Stop checking after 10 seconds
    setTimeout(() => {
        clearInterval(intervalId);
    }, 300);
}
