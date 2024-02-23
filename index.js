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

const usernameSpan = $('#111');
const rankSpan = $('#112');
const rankPSpan = $('#122');
const vipProgressSpan = $('#113');
const ReloadD = $('#114');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'Username') {
        const username11 = request.data;
        console.log(`Username : ${username11}`);
        usernameSpan.text(`Username: ${username11}`);
        $('#sendMessage').text(username11);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'Rank') {
        const rank = request.data;
        console.log(`Rank : ${rank}`);
        
        rankSpan.text(`User Rank: ${rank}`);
    }
    if (request.type === 'Percentage') {
        const persentage = request.data;
        console.log(`Persentage : ${persentage}`);


        vipProgressSpan.text(`VIP Progress: ${persentage}`);

        const percentageFormatted = persentage.replace('%', '').replace(',', '.');
        var progressBar = document.getElementById('myBar');

        var progressBar = document.getElementById('myBar');

        progressBar.style.width = percentageFormatted + '%';
    }
});

$(document).ready(function () {

    const tipButton = $('#tipxlate');

    tipButton.click(function () {
        const selectedStake = stakeSelector.val();
        const selectedCrypto = cryptoSelector.val();
        const urlTipToOpen = `https://${selectedStake}/casino/home?tab=tip&modal=wallet&name=Xlate&currency=${selectedCrypto}`;

        window.open(urlTipToOpen, '_blank');
    });
});

$(document).ready(function () {
    const getUrlParameter = function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const selectedStake = getUrlParameter('selectedStake');
    if (selectedStake) {
        $('#stakeSelector').val(selectedStake);
    }
});

const reloadCheckbox = document.getElementById('reload');
const countdownTimer = document.getElementById('countdownTimer');

let reloadInterval;

function openReloadUrl() {
    const selectedStake = stakeSelector.val();
    const selectedCrypto = cryptoSelector.val();
    const reloadUrl = `https://${selectedStake}/?tab=reload&modal=vip&currency=${selectedCrypto}`;
    window.open(reloadUrl, '_blank');
}

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
        const { time, date } = request.data;
        const currentTime = new Date();
        const [hourss, minutess] = time.split(':').map(str => parseInt(str));
        const [dayss, month, year] = date.split('.').map(str => parseInt(str));
        const reloadTime = new Date(year, month - 1, dayss, hourss, minutess);
        
        if (reloadTime > currentTime) {
            reloadCheckbox.checked = false;
            reloadCheckbox.checked = true;
        } else {
            countdownTimer.textContent = 'Your Reload Finished';
            stopReload();
            reloadCheckbox.checked = false;
        }
    } else if (request.type === 'timeAndDate') {
        const { time, date, date1 } = request.data;
        const formattedDate1 = date1 !== undefined ? date1 : "";
        ReloadD.text(`Reload expires at: ${time} ${date} ${formattedDate1}`);
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
            openReloadUrl();
        } else {
            let nextReloadTime;
            if (isNaN(countDownDate)) {
                nextReloadTime = "Invalid Date";
                reloadCheckbox.checked = false;
                reloadCheckbox.checked = true;
            } else {
                nextReloadTime = countDownDate.toLocaleTimeString();
            }
            countdownTimer.textContent = `Next Reload at: ${nextReloadTime}`;
        }
    }, 1000);
}


function stopReload() {
    clearInterval(reloadInterval);
}

reloadCheckbox.addEventListener('change', function() {
    if (this.checked) {
        openReloadUrl();
    } else {
        stopReload();
    }
});

const disconnectAndReconnect = () => {
    clearLog();
    close();
    setTimeout(() => {
        connectButton.click();
    }, 15000);
    setTimeout(() => {
        clearMsgButton.click();
    }, 3000);
};

const startDisconnectInterval = () => {
    disconnectInterval = setInterval(disconnectAndReconnect, 8500000);
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

    const res = `${hours}:${minutes}`;
    return res;
};

const getBonusCodeDateStr = function () {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

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

    sendMessage.attr('disabled', 'disabled');
};

const onClose = function () {
    ws = null;

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
    if (e.which === 13) {
        sendChatMessageButton.click();
        e.preventDefault();
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

        const selectedStake = stakeSelector.val();
        const selectedCrypto = cryptoSelector.val();
        const urlPrefix = `https://${selectedStake}/settings/offers?type=drop&code=`;
        const urlSuffix = `&currency=${selectedCrypto}&modal=redeemBonus&app=CodeClaim`;
        const url = `${urlPrefix}${bonusCode}${urlSuffix}`;
        window.open(url, '_blank');
    } else {
        console.log('Invalid data format:', data);
    }
};

const displayNewsMessage = function (news) {

};

const handleServerReply = function (reply) {
    const registrationSpan = $('#115');

    if (reply === 'Verifying Username.') {
        return;
    }

    if (reply.includes(' your username verified. You are registered until ')) {
        const usernameIndex = reply.indexOf(',');
        const untilIndex = reply.lastIndexOf('until');
        const username = reply.substring(0, usernameIndex).trim();
        let registrationDate = reply.substring(untilIndex + 6).trim();

        registrationDate = registrationDate.replace(/\./g, '');
        const dateComponents = registrationDate.split('-');
        const formattedDate = `${dateComponents[2]}.${dateComponents[1]}.${dateComponents[0]}`;

        registrationSpan.text(`Server Registration : Registered until ${formattedDate}`);
    } else if (reply === 'Not Registered user, please contact @Ardag7 via Telegram') {
        registrationSpan.text('Server Registration : Not registered User.');
    } else if (reply.startsWith('Access for ')) {
        const username = reply.substring(10, reply.indexOf(' has expired'));

        registrationSpan.text(`Server Registration : Registration for ${username} expired.`);
    } else if (reply.endsWith('already connected, please try another username')) {
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
    if (data === 'Alive') {
        return;
    }
    if (
        data.includes('Not Registered user') ||
        data.includes('has expired') ||
        data.includes('already connected')
    ) {
        setTimeout(() => {
            close();
            return;
        }, 500);

    }

    if (data.startsWith('Chat: ')) {
        const chatMessage = data.substring(6);
        addChatMessage(chatMessage);
        return;
    }

    console.log('Received data:', data);

    handleServerReply(data);

    if (data.startsWith('News: ')) {
        const news = data.substring(6);
        displayNewsMessage(news);
        addNewsMessage(news);
    }
    else if (data.startsWith('Link:')) {
        const linkPrefix = 'https://playstake.info/bonus?code=';
        const link = data.substring(6).trim();

        if ($('#claimAutomatically').is(':checked')) {
            if (link.startsWith(linkPrefix)) {
                const bonus = link.substring(linkPrefix.length);
                const selectedStake = stakeSelector.val();
                const selectedCrypto = cryptoSelector.val();
                const url = `https://${selectedStake}/?bonus=${bonus}&code=${bonus}&currency=${selectedCrypto}&modal=redeemBonus&app=CodeClaim`;

                window.open(url, '_blank');
            }
        } else {
            if (!link.startsWith(linkPrefix)) {
                const url = `${link}`;
                window.open(url, '_blank');
            }
        }
        const news = data.substring(6);
        displayNewsMessage(news);
        addNewsMessage(news);
    }
    else if (data.startsWith('Bonus Code:')) {
        addBonusMessage(data);
    }
    else {
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

    stopDisconnectInterval();
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

    startDisconnectInterval();
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

    const sendMessageObserver = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.id === 'sendMessage') {
                updateConnectButtonState();
            }
        }
    });

    const sendMessageObserverConfig = { childList: true };

    sendMessageObserver.observe(sendMessage.get(0), sendMessageObserverConfig);

    const updateConnectButtonState = function () {
        const username = sendMessage.text().trim();
        const isUsernameValid = username.length >= 4;
        connectButton.prop('disabled', !isUsernameValid);
        connectButton.toggleClass('disabled', !isUsernameValid);
    };

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
    startDisconnectInterval();
});