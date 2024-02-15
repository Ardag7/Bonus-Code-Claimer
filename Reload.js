chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Reload") {
        injectReloadScript();
        console.log('inject will start');
    }
});

function injectReloadScript() {
    console.log('inject started');
    const checkExist = setInterval(function() {
        const buttons = document.querySelector("button[type='submit']");
        let buttonTimeout;

        buttonTimeout = setTimeout(() => {
            clearInterval(checkExist);
            window.close();
        }, 40000); 
        
        if (buttons) {
            clearInterval(checkExist);
            clearTimeout(buttonTimeout);
            console.log('Reload Button found.');
            chrome.runtime.sendMessage({ type: "RBFound" });
            if (buttons.disabled) {
                clearInterval(checkExist);
                clearTimeout(buttonTimeout);
                console.log('Reload Button found but not active.');
                chrome.runtime.sendMessage({ type: "RBFoundNotActive" });
                setTimeout(() => {
                    chrome.runtime.sendMessage({ type: "RBnotactiveandFetchstarted" });
                    fetchCountdownAndSendMessage();
                }, 1000);
            } else {
                clearInterval(checkExist);
                clearTimeout(buttonTimeout);
                chrome.runtime.sendMessage({ type: "RBFoundActive" });
                console.log('Reload Button found and active.');
                setTimeout(() => {
                    buttons.click();
                    chrome.runtime.sendMessage({ type: "RBclicked" });
                    setTimeout(() => {
                        chrome.runtime.sendMessage({ type: "RBclickedandFetchstarted" });
                        fetchCountdownAndSendMessage();
                    }, 10000);
                }, 1000);
            }
        } 
    }, 100);

    function fetchCountdownAndSendMessage() {
        console.log('Countdown fetch started.');
        chrome.runtime.sendMessage({ type: "FetchStarted" });
        
    
        const checkCExist = setInterval(function() {
            let countdownTimeout;
            const countdownContainer = document.querySelector('.timer');
    
            if (countdownContainer) {
                chrome.runtime.sendMessage({ type: "CountDFound" });
                console.log('Countdown found');
                clearInterval(checkCExist);
                clearTimeout(countdownTimeout);
    
                const countdownItems = countdownContainer.querySelectorAll('.item');
                let days, hours, minutes, seconds;
                countdownItems.forEach((item, index) => {
                    const valueElement = item.querySelector('.digits');
                    const value = parseInt(valueElement.innerText.trim());
    
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
                console.log('Countdown sent');
                chrome.runtime.sendMessage({ type: "CountDFoundandsent" });
                chrome.runtime.sendMessage({
                    type: "countdownContainer",
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                }, () => {
                    setTimeout(() => {
                        chrome.runtime.sendMessage({ type: "CountDFoundandsentwinclosing" });
                        window.close();
                    }, 4000);
                });
            } else {
                countdownTimeout = setTimeout(() => {
                    clearInterval(checkCExist);
                    chrome.runtime.sendMessage({ type: "ReloadFinished" });
                    window.close();
                }, 25000);
            }
        }, 100);
    }
    
}