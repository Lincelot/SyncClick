// content.js
console.log("content onStart");

const channel = new BroadcastChannel('SyncClick_Channel');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("onMessage : ", request)
    switch (request.action) {
        case "START_KEYBOARD_BROADCAST":
            addClickListener()
            break;
        case "START_MESSAGE_RECEIVER":
            addMessageEventListener()
            break;
        case "STOP_SYNC":
            removeClickListener();
            removeMessageEventListener();
            break;
    }
});

async function onKeyboardListener(event) {
    console.log("Keybore event : ", event);
    // 符合你的過濾條件 (例如：Ctrl+Shift+X)
    if (event.key.toLowerCase() === '5'||event.key === 'Control') {
        event.preventDefault();
        console.log("我是發送源，正在廣播指令...");

        // 廣播給所有分頁
        channel.postMessage(JSON.stringify({
            "type": event.type,
            "key": event.key,
            "keyCode": event.keyCode,
            "which": event.which,
            "code": event.code,
            "location": event.location,
            "altKey": event.altKey,
            "ctrlKey": event.ctrlKey,
            "metaKey": event.metaKey,
            "shiftKey": event.shiftKey,
            "repeat": event.repeat
        }));
    }
}

async function onKeyupListener(event) {
    // 符合你的過濾條件 (例如：Ctrl+Shift+X)
    if (event.key.toLowerCase() === '5') {
        event.preventDefault();
        console.log("我是發送源，正在廣播指令...");

        channel.postMessage(JSON.stringify({
            "type": 'keyup',
            "key": event.key,
            "keyCode": event.keyCode,
            "which": event.which,
            "code": event.code,
            "location": event.location,
            "altKey": event.altKey,
            "ctrlKey": event.ctrlKey,
            "metaKey": event.metaKey,
            "shiftKey": event.shiftKey,
            "repeat": false
        }));
    }
}

// 發送端邏輯：監聽鍵盤
function addClickListener() {
    document.addEventListener('keydown', onKeyboardListener, true);
    document.addEventListener('keyup', onKeyboardListener, true);
}

function removeClickListener() {
    document.removeEventListener('keydown', onKeyboardListener, true);
    document.removeEventListener('keyup', onKeyboardListener, true);
}

async function onEventListener(event) {
    console.log("收到指令，我是目標分頁，執行動作！");

    var data = JSON.parse(event.data);
    console.log("執行按鍵指令 :", data);
    document.querySelector("canvas")?.dispatchEvent(new KeyboardEvent(data.type, data));
}

// 接收端邏輯：監聽廣播
function addMessageEventListener() {
    channel.addEventListener('message', onEventListener);
}
// 接收端邏輯：監聽廣播
function removeMessageEventListener() {
    channel.removeEventListener('message', onEventListener);
}

