chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Info1") {
        setTimeout(() => {
            injectInfo1Script();
        }, 3000);
    }
});


function injectInfo1Script() {
    // Function to send data to the background script
    function sendDataToBackground(data) {
        chrome.runtime.sendMessage({ type: "UserInfo", data: data });
    }
    
    function extractAndSendUserInfo() {
        const usernameElement = document.querySelector('.content-user .size-lg');
        const PersentageElement = document.querySelector('.percent-label .numeric');
        const RankElement = document.querySelector('.svelte-azdvxm');



            const username = usernameElement.textContent.trim();
            const persentage = PersentageElement.textContent.trim();
            const rank = RankElement.textContent.trim();

            
            // Send the extracted information to the background script
            sendDataToBackground({ username , rank , persentage });
            setTimeout(() => {
                window.close();
            }, 500);
        
    }

    // Attach the event listener for DOMContentLoaded to wait for the page to fully load
    document.addEventListener('DOMContentLoaded', extractAndSendUserInfo);
    
    // You can also call extractAndSendUserInfo directly in case the page is already loaded
    extractAndSendUserInfo();

    chrome.runtime.sendMessage({ type: "Done" });
}
