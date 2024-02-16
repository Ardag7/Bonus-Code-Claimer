let ws = null;
let serverHost = '';
let serverParams = '';
let filterMessage = '';
let lastMsgsNum = '';
let binaryType = '';
let showMsgTsMilliseconds = '';
let connectionStatus;
let sendMessage;
let oldSendMessageVal = '';
let messages;
let viewMessage;
let viewMessageChk;
let connectButton;
let disconnectButton;
let sendButton;
let sendButtonHelp;
let clearMsgButton;
let parseURLButton = '';
let disconnectInterval;

const MAX_LINES_COUNT = 1000;
const STG_URL_PARAMS_KEY = 'ext_swc_params';
const STG_BIN_TYPE_KEY = 'ext_swc_bintype';
const STG_REQUEST_KEY = 'ext_swc_request';
const STG_MSG_TS_MS_KEY = 'ext_swc_msg_ts_ms';
const STG_MSGS_NUM_KEY = 'ext_swc_msgs_num';
const SERVER_URL = 'ws://34.141.40.143:8080';
const stakeSelector = $('#stakeSelector');
const cryptoSelector = $('#cryptoSelector');
const chatHistory = $('#chatHistory');
const chatMessageInput = $('#chatMessage');
const sendChatMessageButton = $('#sendChatMessage');

let lastMsgsNumCur = MAX_LINES_COUNT;

// Define variables for the spans
const usernameSpan = $('#111');
const rankSpan = $('#112');
const rankPSpan = $('#122');
const vipProgressSpan = $('#113');
const ReloadD = $('#114');


// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'UserInfo') {
        const { username, rank, persentage } = request.data;
        
        // Update the spans with the received user information
        usernameSpan.text(`Username: ${username}`);
        rankSpan.text(`User Rank: ${rank}`);
        vipProgressSpan.text(`VIP Progress: ${persentage}`);

        $('#sendMessage').text(username);
        const percentageFormatted = persentage.replace('%', '').replace(',', '.');
        var progressBar = document.getElementById('myBar');

        // Select the progress bar element
        var progressBar = document.getElementById('myBar');

        // Set the width of the progress bar
        progressBar.style.width = percentageFormatted + '%';
    }
});

$(document).ready(function () {
    // Wait for the document to be fully loaded

    // Select the "Test" button by its ID
    const testButton = $('#test');

    // Add a click event handler to the "Test" button
    testButton.click(function () {
        // URL to be opened in a new tab
        const urlToOpen = 'https://stake.com/?tab=rakeback&modal=vip';

        // Open the URL in a new tab
        window.open(urlToOpen, '_blank');
    });
});

$(document).ready(function () {
    // Wait for the document to be fully loaded

    // Select the "Test" button by its ID
    const tipButton = $('#tipxlate');

    // Add a click event handler to the "Test" button
    tipButton.click(function () {
        const selectedStake = stakeSelector.val();
        const selectedCrypto = cryptoSelector.val();
        const urlTipToOpen = `https://${selectedStake}/casino/home?tab=tip&modal=wallet&name=Xlate&currency=${selectedCrypto}`;

        // Open the URL in a new tab
        window.open(urlTipToOpen, '_blank');
    });
});

$(document).ready(function () {
    // Function to get URL parameters
    const getUrlParameter = function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    // Retrieve the selected domain from the URL parameter
    const selectedStake = getUrlParameter('selectedStake');
    if (selectedStake) {
        // Set the default value for the domain selector
        $('#stakeSelector').val(selectedStake);
    }
});

// Get DOM elements
const reloadCheckbox = document.getElementById('reload');
const countdownTimer = document.getElementById('countdownTimer');

let reloadInterval;


// Function to construct reload URL and open it
function openReloadUrl() {
    const selectedStake = stakeSelector.val();
    const selectedCrypto = cryptoSelector.val();
    const reloadUrl = `https://${selectedStake}/?tab=reload&modal=vip&currency=${selectedCrypto}`;
    window.open(reloadUrl, '_blank');
}

// Function to handle messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'countdownContainer') {
        clearInterval(reloadInterval);
        const { days, hours, minutes, seconds } = request;
        // Start countdown
        startCountdown(hours, minutes, seconds);
    } else if (request.type === 'NoReloadwindowsClosingin5sec') {
        countdownTimer.textContent = 'No Active Reload';
        stopReload();
        reloadCheckbox.checked = false;
    } else if (request.type === 'ReloadFinished') {
        const { time, date } = request.data; // Destructure time and date from request data
        const currentTime = new Date();
        const [hourss, minutess] = time.split(':').map(str => parseInt(str));
        const [dayss, month, year] = date.split('.').map(str => parseInt(str));
        const reloadTime = new Date(year, month - 1, dayss, hourss, minutess); // month is 0-based index, hence month - 1
        
        // Check if reload time is later than current time
        if (reloadTime > currentTime) {
            reloadCheckbox.checked = false;
            reloadCheckbox.checked = true;
        } else {
            countdownTimer.textContent = 'Your Reload Finished';
            stopReload();
            reloadCheckbox.checked = false;
        }
    } else if (request.type === 'timeAndDate') {
        const { time, date } = request.data;
        ReloadD.text(`Reload expires at: ${time} ${date}`);
    }
});

function startCountdown(hours, minutes, seconds) {
    const now = new Date().getTime();
    const countDownDate = new Date(now + hours*60*60*1000 + minutes*60*1000 + seconds*1000);

    reloadInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            clearInterval(reloadInterval);
            openReloadUrl(); // Call your function here
        } else {
            let nextReloadTime;
            if (isNaN(countDownDate)) {
                nextReloadTime = "Invalid Date";
                reloadCheckbox.checked = false;
                reloadCheckbox.checked = true;
            } else {
                nextReloadTime = countDownDate.toLocaleTimeString(); // Convert to local time string
            }
            countdownTimer.textContent = `Next Reload at: ${nextReloadTime}`;
        }
    }, 1000);
}


// Function to stop reload interval
function stopReload() {
    clearInterval(reloadInterval);
}

// Event listener for checkbox change
reloadCheckbox.addEventListener('change', function() {
    if (this.checked) {
        openReloadUrl();
    } else {
        stopReload();
    }
});

const disconnectAndReconnect = () => {
    clearLog(); // Clear messages log
    close(); // Disconnect
    setTimeout(() => {
        connectButton.click();
    }, 15000);
    setTimeout(() => {
        clearMsgButton.click();
    }, 3000);
};

const startDisconnectInterval = () => {
    disconnectInterval = setInterval(disconnectAndReconnect, 8500000); // 4 hours in milliseconds
};

const stopDisconnectInterval = () => {
    clearInterval(disconnectInterval);
};

const JSONColorScheme = {
    keyColor: 'black',
    numberColor: 'blue',
    stringColor: 'green',
    trueColor: 'firebrick',
    falseColor: 'firebrick',
    nullColor: 'gray',
};

const isBinaryTypeArrayBuffer = function () {
    return binaryType.val() === 'arraybuffer';
};

const getUrl = function () {
    let url = `ws://34.141.40.143:8080`;
    return url;
};

const getNowDateStr = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Customize the format as needed
    const res = `${hours}:${minutes}`;
    return res;
};

const getMainLogDateStr = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Customize the format as needed
    const res = `${hours}:${minutes}`;
    return res;
};

const getBonusCodeDateStr = function () {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Customize the format as needed
    const res = `${hours}:${minutes}:${seconds}`;
    return res;
};

const enableConnectButton = function () {
    connectButton.hide();
    disconnectButton.show();
};

const disableConnectButton = function () {
    connectButton.show();
    disconnectButton.hide();
};

const wsIsAlive = function () {
    return (typeof (ws) === 'object'
        && ws !== null
        && 'readyState' in ws
        && ws.readyState === ws.OPEN
    );
};

const onOpen = function () {
    console.log(`Connected: ${getUrl()}`);
    connectionStatus.css('color', '#00ff3c');
    connectionStatus.text(`Connected`);
    sendButton.removeAttr('disabled');
    sendButtonHelp.removeClass('disabledText');
    lastMsgsNum.removeAttr('disabled');

    // Disable the sendMessage textarea
    sendMessage.attr('disabled', 'disabled');
};

const onClose = function () {
    ws = null;

    // Enable the sendMessage textarea
    sendMessage.removeAttr('disabled');
};

sendChatMessageButton.click(function () {
    const message = chatMessageInput.val();
    if (message.trim() !== '') {
        ws.send(`Chat: ${message}`);
        chatMessageInput.val('');
    }
});

chatMessageInput.keydown(function (e) {
    if (e.which === 13) { // 13 is the key code for Enter
        sendChatMessageButton.click(); // Trigger the click event of the sendChatMessageButton
        e.preventDefault(); // Prevent the default behavior of the "Enter" key (e.g., adding a new line)
    }
});

const addChatMessage = function (message) {
    const msg = $('<div>').text(message);
    chatHistory.append(msg);

    const chatHistoryBox = chatHistory.get(0);
    chatHistoryBox.scrollTop = chatHistoryBox.scrollHeight;
};

const showViewMessagePanel = function () {
    if (viewMessage.is(':visible')) {
        return;
    }
    messages.css('width', 'calc(20vw - 34px)');
    viewMessage.attr('class', 'viewMessage');
    viewMessage.show();
    viewMessageChk.prop('checked', true);
};

const messageClickHandler = function (event) {
    if (!event.ctrlKey && !event.metaKey) {
        return;
    }
    viewMessage.text('');
    let dataDecoded;
    try {
        dataDecoded = JSON.parse(
            $(this).html().replace(/^\[[^\]]+?\]\s*/, ''),
        );
    } catch (e) {
        console.error(`could not parse json: ${e.message}`);
        return;
    }
    const colorizedJSON = jsonFormatHighlight(dataDecoded, JSONColorScheme);
    if (colorizedJSON === 'undefined') {
        return;
    }
    showViewMessagePanel();
    viewMessage.html(colorizedJSON);

    messages.find('pre').each(function () {
        $(this).css('background-color', '#fff');
    });
    $(this).css('background-color', '#eee');
};

const addNewsMessage = function (news) {
    const newsMsg = $('<pre>').text(news);
    newsMsg.click(messageClickHandler);

    $('#newsMessages').append(newsMsg);

    const newsMsgBox = document.getElementById('newsMessages');
    while (newsMsgBox.childNodes.length > lastMsgsNumCur) {
        newsMsgBox.removeChild(newsMsgBox.firstChild);
    }
    newsMsgBox.scrollTop = newsMsgBox.scrollHeight;
};

const addMessage = function (data, type) {
    const msg = $('<pre>').text(`[${getMainLogDateStr()}] ${data}`);
    msg.click(messageClickHandler);
    const filterValue = filterMessage.val();

    if (filterValue && data.indexOf(filterValue) === -1) {
        msg.attr('hidden', true);
    }

    if (type === 'SENT') {
        msg.addClass('sent');
    }
    const bonusCodePrefix = 'Bonus Code:';
    if (data.startsWith(bonusCodePrefix)) {
        const bonusCode = data.substring(bonusCodePrefix.length).trim();
        const bonusCodeSpan = $('<span>').text(bonusCode).addClass('bonus-code');
        msg.html(`[${getNowDateStr()}] ${bonusCodePrefix} ${bonusCodeSpan[0].outerHTML}`);
    }

    messages.append(msg);

    const msgBox = messages.get(0);
    while (msgBox.childNodes.length > lastMsgsNumCur) {
        msgBox.removeChild(msgBox.firstChild);
    }
    msgBox.scrollTop = msgBox.scrollHeight;
};

const addBonusMessage = function (data) {
    const bonusCodePrefix = 'Bonus Code:';

    if (data.startsWith(bonusCodePrefix)) {
        const bonusCode = data.substring(bonusCodePrefix.length).trim();
        const msg = $('<pre>').text(`[${getBonusCodeDateStr()}] ${bonusCodePrefix} ${bonusCode}`);
        msg.click(messageClickHandler);
        $('#bonusMessages').append(msg);

        const msgBox = document.getElementById('bonusMessages');
        while (msgBox.childNodes.length > lastMsgsNumCur) {
            msgBox.removeChild(msgBox.firstChild);
        }
        msgBox.scrollTop = msgBox.scrollHeight;

        // Extracted code to open URL
        const selectedStake = stakeSelector.val();
        const selectedCrypto = cryptoSelector.val();
        const urlPrefix = `https://${selectedStake}/settings/offers?type=drop&code=`;
        const urlSuffix = `&currency=${selectedCrypto}&modal=redeemBonus`;
        const url = `${urlPrefix}${bonusCode}${urlSuffix}`;
        window.open(url, '_blank');
    } else {
        console.log('Invalid data format:', data);
    }
};

const displayNewsMessage = function (news) {

};

// Function to handle server reply and update the registration info
const handleServerReply = function (reply) {
    const registrationSpan = $('#115');

    if (reply === 'Verifying Username.') {
        // Ignore the "Verifying Username." message
        return;
    }

    if (reply.includes(' your username verified. You are registered until ')) {
        // Extract the username and registration date from the reply
        const usernameIndex = reply.indexOf(',');
        const untilIndex = reply.lastIndexOf('until');
        const username = reply.substring(0, usernameIndex).trim(); // Extract the username
        let registrationDate = reply.substring(untilIndex + 6).trim(); // Extract the registration date

        // Format the registration date as DD-MM-YYYY
        registrationDate = registrationDate.replace(/\./g, ''); // Remove any periods
        const dateComponents = registrationDate.split('-');
        const formattedDate = `${dateComponents[2]}.${dateComponents[1]}.${dateComponents[0]}`;

        // Update the registration info in the span
        registrationSpan.text(`Server Registration : Registered until ${formattedDate}`);
    } else if (reply === 'Not Registered user, please contact @Ardag7 via Telegram') {
        registrationSpan.text('Server Registration : Not registered User.');
    } else if (reply.startsWith('Access for ')) {
        // Extract the username from the reply
        const username = reply.substring(10, reply.indexOf(' has expired'));

        registrationSpan.text(`Server Registration : Registration for ${username} expired.`);
    } else if (reply.endsWith('already connected, please try another username')) {
        // Extract the username from the reply
        const username = reply.substring(0, reply.indexOf(' already connected'));

        registrationSpan.text(`Server Registration : User already connected with username ${username}.`);
    } 
};

const onMessage = function (event) {
    let data = event.data;
    if (isBinaryTypeArrayBuffer()) {
        const buffer = new Uint8Array(data);
        data = new TextDecoder().decode(buffer).slice(1);
    }

    // Check if the received message is "Alive" and skip logging
    if (data === 'Alive') {
        return;
    }

    // Check if the message contains any of the specified phrases to close the connection
    if (
        data.includes('Not Registered user') ||
        data.includes('has expired') ||
        data.includes('already connected')
    ) {
        setTimeout(() => {
            close(); // Close the connection
            return;
        }, 500);

    }

    if (data.startsWith('Chat: ')) {
        const chatMessage = data.substring(6);
        addChatMessage(chatMessage);
        return;
    }

    console.log('Received data:', data); // Log the received data for debugging

    handleServerReply(data); // Call the function to handle the server reply

    // Check if the received message starts with 'News: '
    if (data.startsWith('News: ')) {
        const news = data.substring(6); // Extract the news part
        displayNewsMessage(news); // Call the displayNewsMessage function
        addNewsMessage(news); // Add news message to the new div
    }
    else if (data.startsWith('Link:')) {
        const linkPrefix = 'https://playstake.info/bonus?code=';
        const link = data.substring(6).trim(); // Extract the link part

        if ($('#claimAutomatically').is(':checked')) {
            if (link.startsWith(linkPrefix)) {
                const bonus = link.substring(linkPrefix.length);
                const selectedStake = stakeSelector.val();
                const selectedCrypto = cryptoSelector.val();
                const url = `https://${selectedStake}/?bonus=${bonus}&code=${bonus}&currency=${selectedCrypto}&modal=redeemBonus`;

                // Add your logic here or open the new URL in a new window
                window.open(url, '_blank');
            }
        } else {
            // Open the URL without checkbox condition
            if (!link.startsWith(linkPrefix)) {
                const url = `${link}`;
                window.open(url, '_blank');
            }
        }
        // Original code for displaying and adding news message
        const news = data.substring(6); // Extract the news part
        displayNewsMessage(news); // Call the displayNewsMessage function
        addNewsMessage(news); // Add news message to the new div
    }
    else if (data.startsWith('Bonus Code:')) {
        // Handle Bonus Code messages
        addBonusMessage(data);
    }
    else {
        // Handle other types of messages
        addMessage(data);
    }
};

const close = function () {
    if (wsIsAlive()) {
        console.log('Disconnecting ...');
        ws.close();
    }
    connectionStatus.css('color', '#ff0000');
    connectionStatus.text('Disconnected');
    console.log(`Disconnected: ${getUrl()}`);


    disableConnectButton();
    sendButton.attr('disabled', 'disabled');
    sendButtonHelp.addClass('disabledText');
    lastMsgsNum.removeAttr('disabled');

    stopDisconnectInterval(); // Stop the interval when manually closing the connection
};

const onError = function (event) {
    if (event.data !== undefined) {
        console.error(`ERROR: ${event.data}`);
    }
    close();
};

const open = function () {
    lastMsgsNumCur = Number(parseInt(lastMsgsNum.val(), 10));
    if (Number.isNaN(lastMsgsNumCur)) {
        lastMsgsNumCur = MAX_LINES_COUNT;
    } else {
        lastMsgsNum.val(lastMsgsNumCur);
    }

    const url = getUrl();
    ws = new WebSocket(url);
    if (isBinaryTypeArrayBuffer()) {
        ws.binaryType = 'arraybuffer';
    }
    ws.onopen = onOpen;
    ws.onclose = onClose;
    ws.onmessage = onMessage;
    ws.onerror = onError;

    connectionStatus.css('color', '#d9ff00');
    connectionStatus.text('Connecting ...');
    enableConnectButton();

    startDisconnectInterval(); // Start the interval when the connection is established
};

const clearLog = function () {
    messages.html('');
    viewMessage.html('');
};

const onFilter = function (event) {
    messages.find('pre').each(function () {
        const element = $(this);

        if (element.html().indexOf(event.target.value) === -1) {
            element.attr('hidden', true);
        } else {
            element.removeAttr('hidden');
        }
    });
};

const viewMessageToggle = function () {
    if ($(this).is(':checked')) {
        showViewMessagePanel();
    } 
};

const connectButtonOnClick = function () {
    if (wsIsAlive()) {
        close();
    }
    open();
    const username = usernameSpan.text().split(': ')[1];
    if (username.length >= 4) {
        setTimeout(() => {
            ws.send(username);
        }, 3000);
    }
};

const sendMessageOnKeydown = function (e) {
    if (wsIsAlive()
        && e.which === 13 && e.ctrlKey
    ) {
        sendButton.click();
    }
};

const sendMessageOnChange = function () {
    const msg = sendMessage.val();
    if (msg === oldSendMessageVal) {
        return;
    }
    oldSendMessageVal = msg;
    localStorage.setItem(STG_REQUEST_KEY, msg);
};

const showMsgTsMillisecondsOnChange = function () {
    localStorage.setItem(
        STG_MSG_TS_MS_KEY,
        showMsgTsMilliseconds.is(':checked'),
    );
};

const init = function () {

    binaryType = $('#binaryType');
    filterMessage = $('#filterMessage');
    lastMsgsNum = $('#lastMsgsNum');

    connectionStatus = $('#connectionStatus');

    
    connectButton = $('#connectButton');
    disconnectButton = $('#disconnectButton');
    sendButton = $('#sendButton');
    sendButtonHelp = $('#sendButtonHelp');
    clearMsgButton = $('#clearMessage');
    showMsgTsMilliseconds = $('#showMsgTsMilliseconds');
    viewMessageChk = $('#viewMessageChk');
    parseURLButton = $('#parseURLButton');

    messages = $('#messages');
    viewMessage = $('#viewMessage');
    sendMessage = $('#sendMessage');

    // Implement a MutationObserver
    const sendMessageObserver = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            // Check if the mutation type is 'childList' and the target node is 'sendMessage'
            if (mutation.type === 'childList' && mutation.target.id === 'sendMessage') {
                // Update the connect button state when the content of 'sendMessage' changes
                updateConnectButtonState();
            }
        }
    });

    // Configure the observer to watch for changes to the child nodes of 'sendMessage'
    const sendMessageObserverConfig = { childList: true };

    // Start observing the 'sendMessage' element for changes
    sendMessageObserver.observe(sendMessage.get(0), sendMessageObserverConfig);

    // Update the connect button state function
    const updateConnectButtonState = function () {
        const username = sendMessage.text().trim(); // Trim the input to remove leading and trailing spaces
        const isUsernameValid = username.length >= 4; // Check if the username length is at least 4 characters
        connectButton.prop('disabled', !isUsernameValid); // Disable the connect button if the username is not valid
        connectButton.toggleClass('disabled', !isUsernameValid); // Add a class to visually indicate that the button is disabled
    };

    // Call the updateConnectButtonState function initially
    updateConnectButtonState();
    
    
    
    updateConnectButtonState();

    connectButton.click(connectButtonOnClick);
    
    disconnectButton.click(close);


    filterMessage.on('input', onFilter);
    showMsgTsMilliseconds.change(showMsgTsMillisecondsOnChange);
    viewMessageChk.change(viewMessageToggle);

    sendMessage
    .keydown(sendMessageOnKeydown)
    .on('change', sendMessageOnChange);

    clearMsgButton.click(clearLog);
    filterMessage.on('input', onFilter);
    showMsgTsMilliseconds.change(showMsgTsMillisecondsOnChange);
    viewMessageChk.change(viewMessageToggle);
};

$(() => {
    init();
    startDisconnectInterval(); // Start the interval when the page is loaded
});