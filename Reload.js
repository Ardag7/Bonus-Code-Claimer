chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Reload") {
        if (document.readyState === "loading") {
            document.addEventListener('DOMContentLoaded', injectReload2Script);
        } else {
            injectReload2Script();
        }
        console.log('inject will start');
    }
});

function extractTimeAndDate() {
    const element = document.querySelector('span.svelte-1d6bfct span.chromatic-ignore');
    if (element) {
        const dateTimeString = element.innerText.trim();
        const [time, date, date1] = dateTimeString.split(' ');
        return { time, date, date1 };
    }
    return null;
}
function fetchTimeAndDateAndSendMessage() {
    const timeAndDate = extractTimeAndDate();
    if (timeAndDate) {
        chrome.runtime.sendMessage({ type: 'timeAndDate', data: timeAndDate });
    }
}
function injectReload2Script() {
    const maxAttempts = 50;
    let attempts = 0;

    const checkExist = setInterval(() => {
        const timeAndDate = extractTimeAndDate();
        if (timeAndDate) {
            chrome.runtime.sendMessage({ type: "ReloadFound1" });
            clearInterval(checkExist);
            fetchTimeAndDateAndSendMessage();
            injectReloadScript();
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(checkExist);
                chrome.runtime.sendMessage({ type: "NoReloadwindowsClosingin5sec" });
                setTimeout(() => {
                    window.close();
                }, 5000);
            }
        }
    }, 100);

    const buttonTimeout = setTimeout(() => {
        clearInterval(checkExist);
        window.close();
    }, 40000); 
}

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
                }, 3000);
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
                            if (!isNaN(value)) {
                                days = value;
                            }
                            break;
                        case 1:
                            if (!isNaN(value)) {
                                hours = value;
                            }
                            break;
                        case 2:
                            if (!isNaN(value)) {
                                minutes = value;
                            }
                            break;
                        case 3:
                            if (!isNaN(value)) {
                                seconds = value;
                            }
                            break;
                        default:
                            break;
                    }
                });
    
                if (days !== undefined && hours !== undefined && minutes !== undefined && seconds !== undefined) {
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
                    fetchCountdownAndSendMessage();
                }
            } else {
                countdownTimeout = setTimeout(() => {
                    clearInterval(checkCExist);
                    chrome.runtime.sendMessage({ type: "ReloadFinished" });
                    window.close();
                }, 30000);
            }
        }, 100);
    } 
}
