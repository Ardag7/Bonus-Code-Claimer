chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "Bonus") {
    setTimeout(() => {
      injectBonusScript();
    }, 1000);
  }
});

function injectBonusScript() {
  const checkExist = setInterval(function() {
      const button = document.querySelector("button[type='submit']");
      if (button) {
          clearInterval(checkExist);
          chrome.runtime.sendMessage({ type: 'BonusButtonfound' });
          let clickCount = 0;
          const clickInterval = setInterval(() => {
              if (clickCount < 6) {
                  button.click();
                  clickCount++;
              } else {
                  clearInterval(clickInterval);
                  console.log('Bonus Button clicked.');
                  setTimeout(() => {
                    window.close();
                }, 45000);
              }
          }, 50);
      }
      
      else {
          console.log('Bonus Button not found.');
          chrome.runtime.sendMessage({ type: 'BonusButtonnotfound' });
          setTimeout(() => {
            clearInterval(checkExist);
            window.close();
          }, 25000);
      }
  }, 100); // checks every 100ms


  chrome.runtime.sendMessage({ type: "Done" });
}