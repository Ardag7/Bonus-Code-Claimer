chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index1.html'),
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  if (changeInfo.status === 'complete' && tab.url.includes('redeemBonus')) {
    chrome.tabs.sendMessage(tabId, { type: "Bonus" });
    console.log('Message sent to Script-Bonus');
  }

  if ((changeInfo.status === 'complete' && (tab.url.includes('reload')) && !tab.url.includes('redeemBonus'))) {
    chrome.tabs.sendMessage(tabId, { type: "Reload" });
    console.log('Message sent to Script-Reload');
  }

  else if (changeInfo.status === 'complete' && tab.url.includes('rakeback')) {
    chrome.tabs.sendMessage(tabId, { type: "Rakeback" });
    console.log('Message sent to Script-Rakeback');
  }

  else if (changeInfo.status === 'complete' && tab.url.includes('tab=progress')) {
    chrome.tabs.sendMessage(tabId, { type: "Info1" });
    console.log('Message sent to Script-Info1');
  }

  else if (changeInfo.status === 'complete' && tab.url.includes('promotion/weekly-giveaway')) {
    chrome.tabs.sendMessage(tabId, { type: "Info2" });
    console.log('Message sent to Script-Info2');
  }

});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

      if (request.type === 'countdownContainer') {
        const {days, hours, minutes, seconds} = request;
        console.log(`Received countdown data: Day=${days}, Hour=${hours}, Min=${minutes}, Sec=${seconds}`);
      } else if (request.type === 'noCountdown') {
          console.log('No countdown found.');
      } else if (request.type === 'NotActiveCode') {
          console.log('Code is not active.');
      } else if (request.type === 'Buttonnotfound') {
          console.log('Reload Button not found.');
      } else if (request.type === 'Buttonfound') {
          console.log('Buton Found.');
      } else if (request.type === 'Done') {
          console.log('Injection working.');
      } else if (request.type === 'RakebackButtonnotfound') {
        console.log('Rakeback Button not found.');
      } else if (request.type === 'RakebackButtonfound') {
        console.log('Rakeback Button found.');
      } else if (request.type === 'BonusButtonfound') {
        console.log('Bonus Button found.');
      } else if (request.type === 'BonusButtonnotfound') {
        console.log('Bonus Button not found.');
      } else if (request.type === 'Reloadbuttonfound') {
        console.log('Reload Button found.');
      } else if (request.type === 'Countdownfound') {
        console.log('Countdown Found');
      }else if (request.type === 'CountDFoundandsentwinclosing') {
        console.log('CountDown Found, sent, Window closing');
      }else if (request.type === 'CountDFoundandsent') {
        console.log('Countdown Found and sent');
      }else if (request.type === 'CountDFound') {
        console.log('Countdown Found');
      }else if (request.type === 'FetchStarted') {
        console.log('Fetch Started');
      }else if (request.type === 'NoReloadwindowsClosingin5sec') {
        console.log('No Reload found, closing window in 5 sec');
      }else if (request.type === 'RBclickedandFetchstarted') {
        console.log('Button clicked and fetch start comment sent');
      }else if (request.type === 'RBclicked') {
        console.log('Button clicked');
      }else if (request.type === 'RBFoundActive') {
        console.log('Active button found');
      }else if (request.type === 'RBnotactiveandFetchstarted') {
        console.log('Button found, not active, Fetch will start');
      }
      else if (request.type === 'RBFoundNotActive') {
        console.log('Button found, not active');
      }else if (request.type === 'RBFound') {
        console.log('Button found');
      }else if (request.type === 'timeAndDate') {
        const { time, date } = request.data; // Access data property
        console.log(`Reload Expires at : Time=${time}, Date=${date}`);
    }
  }
);