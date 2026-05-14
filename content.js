// content.js
console.log("content onStart");

const ALLOWED_CODES = new Set([
    'Digit1',     // 鍵盤上方的 1
    'Digit2',     // 鍵盤上方的 2
    'Digit3',     // 鍵盤上方的 3
    'Digit4',     // 鍵盤上方的 4
    'Digit5',     // 鍵盤上方的 5
    'Digit6',     // 鍵盤上方的 6
    'Digit7',     // 鍵盤上方的 7
    'Digit8',     // 鍵盤上方的 8
    'Digit9',     // 鍵盤上方的 9
    'Digit0',     // 鍵盤上方的 0
    'F1',     // 鍵盤上方的 F1
    'F2',     // 鍵盤上方的 F2
    'F3',     // 鍵盤上方的 F3
    'F4',     // 鍵盤上方的 F4
    'F5',     // 鍵盤上方的 F5
    'F6',     // 鍵盤上方的 F6
    'F7',     // 鍵盤上方的 F7
    'F8',     // 鍵盤上方的 F8
    'ControlLeft', // 左Ctrl
    'ShiftLeft', // 左Shift
    'AltLeft', // 左Alt
    'KeyZ' // z
]);

const channel = new BroadcastChannel('SyncClick_Channel');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("onMessage : ", request)
    switch (request.action) {
        case "START_KEYBOARD_BROADCAST":
            addClickListener();
            sendResponse({ status: "success" });
            break;
        case "START_MESSAGE_RECEIVER":
            addMessageEventListener();
            sendResponse({ status: "success" });
            break;
        case "STOP_SYNC":
            removeClickListener();
            removeMessageEventListener();
            sendResponse({ status: "success" });
            break;
    }
});

function onKeyboardListener(event) {
    console.log("Keybore event : ", event);
    // 符合你的過濾條件 (例如：Ctrl+Shift+X)
    if (ALLOWED_CODES.has(event.code)) {
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

// 發送端邏輯：監聽鍵盤
function addClickListener() {
    document.addEventListener('keydown', onKeyboardListener, true);
    document.addEventListener('keyup', onKeyboardListener, true);
}

function removeClickListener() {
    document.removeEventListener('keydown', onKeyboardListener, true);
    document.removeEventListener('keyup', onKeyboardListener, true);
}

function onEventListener(event) {
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

