chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Rakeback") {
        injectRakebackScript();
    }
});

function injectRakebackScript() {
    const checkExist = setInterval(function() {
        const button = document.querySelector("button[type='submit']");
        if (button) {
            console.log('Button found.');
            button.click();
            console.log('Button clicked.');
            chrome.runtime.sendMessage({ type: 'RakebackButtonfound' });
            clearInterval(checkExist);
            setTimeout(() => {
                window.close();
            }, 8000);
        } else {
            console.log('Button not found.');
        }
    }, 500); // checks every 5000ms
    chrome.runtime.sendMessage({ type: "Done" });
}
