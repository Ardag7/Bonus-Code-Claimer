chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "Info1") {
        setTimeout(() => {
            injectInfo1Script();
        }, 750);
    }
});

function injectInfo1Script() {
    chrome.runtime.sendMessage({ type: "Done" });
    function sendDataToBackground(data) {
        chrome.runtime.sendMessage({ type: "UserInfo", data: data });
    }
    
    function extractAndSendUserInfo() {
        const usernameElement = document.querySelector("#svelte > div.modal.svelte-ufp6wn > div.card.svelte-ufp6wn > div.content.scrollY.scroll-contain.svelte-ufp6wn > div > div.content.svelte-a5oxrf > div.progress-wrap.svelte-1fq2y74 > div > div > div.content-wrapper.svelte-10sldpz > div.content-user.svelte-10sldpz > span");
        const percentageElement = document.querySelector("#svelte > div.modal.svelte-ufp6wn > div.card.svelte-ufp6wn > div.content.scrollY.scroll-contain.svelte-ufp6wn > div > div.content.svelte-a5oxrf > div.progress-wrap.svelte-1fq2y74 > div > div > div.content-wrapper.svelte-10sldpz > div.vip-progress-wrapper.svelte-1uxrf3q > div > div.progress-heading.svelte-h0vqv3 > div > span");
        const rankElement = document.querySelector("#svelte > div.modal.svelte-ufp6wn > div.card.svelte-ufp6wn > div.content.scrollY.scroll-contain.svelte-ufp6wn > div > div.content.svelte-a5oxrf > div.progress-wrap.svelte-1fq2y74 > div > div > div.content-wrapper.svelte-10sldpz > div.vip-progress-wrapper.svelte-1uxrf3q > div > div.progress-bar-wrap.svelte-1g2z0q3 > div.milestone-wrap.svelte-1g2z0q3 > div.milestone-outer.svelte-3okm3b.passed.orientation-bottom > div > div > span:nth-child(2)");

        if (usernameElement && percentageElement && rankElement) {
            const username = usernameElement.textContent.trim();
            const percentage = percentageElement.textContent.trim();
            const rank = rankElement.textContent.trim();

            chrome.runtime.sendMessage({ type: 'Username', data: username });
            chrome.runtime.sendMessage({ type: 'Percentage', data: percentage });
            chrome.runtime.sendMessage({ type: 'Rank', data: rank });

            setTimeout(() => {
                window.close();
            }, 1500);
        } else {
            console.error("One or more elements not found");
        }
    }
    document.addEventListener('DOMContentLoaded', extractAndSendUserInfo);
    extractAndSendUserInfo();
}
