// content.js
console.log("content onStart");
const FILTER_CONFIG = {
    key: '5',/*,
    ctrlKey: true,
    shiftKey: true*/
};

const channel = new BroadcastChannel('SyncClick_Channel');
let myTabId = null;
let sourceTabId = null;
let targetTabIds = null;


// 1. 初始化：取得自己的 Tab ID
chrome.runtime.sendMessage({ action: "GET_TAB_ID" }, (response) => {
    myTabId = response.tabId;
    console.log("SyncClick 已啟動，我的 Tab ID 是:", myTabId);
});

chrome.runtime.sendMessage({ action: "GET_SOURCE_TAB_ID", key: "sourceTabId" }, (response) => {
        console.log("GET_SOURCE_TAB_ID response is ", response);
        sourceTabId = response.sourceTabId
        resolve(response);
    });

chrome.runtime.sendMessage({ action: "GET_TARGET_TAB_IDS", key: "targetTabIds" }, (response) => {
        console.log("GET_TARGET_TAB_IDS response is ", response);
        targetTabIds = response.targetTabIds
        resolve(response);
    });

// 2. 發送端邏輯：監聽鍵盤
document.addEventListener('keydown', async (event) => {
    // 檢查是否為發送源 (這裡假設你把來源 ID 存在 storage 的 'sourceTabId')
    // const _sourceTabId = await chrome.storage.local.get('sourceTabId');
    console.log("myTabId is ", myTabId);
    console.log("sourceTabId is ", sourceTabId);
    if (myTabId === sourceTabId) {
        // 符合你的過濾條件 (例如：Ctrl+Shift+X)
        if (/*event.ctrlKey && event.shiftKey && */event.key.toLowerCase() === '5') {
            event.preventDefault();
            console.log("我是發送源，正在廣播指令...");
            
            // 廣播給所有分頁
            // channel.postMessage({
            //     action: "EXECUTE_CLICK",
            //     type: 'keydown',
            //     key: event.key/*,
            //     ctrlKey: event.ctrlKey,
            //     shiftKey: event.shiftKey*/
            // });
            channel.postMessage(JSON.stringify({
                "type": 'keydown',
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
}, true);
document.addEventListener('keyup', async (event) => {
    // 檢查是否為發送源 (這裡假設你把來源 ID 存在 storage 的 'sourceTabId')
    // const _sourceTabId = await chrome.storage.local.get('sourceTabId');
    console.log("myTabId is ", myTabId);
    console.log("sourceTabId is ", sourceTabId);
    if (myTabId === sourceTabId) {
        // 符合你的過濾條件 (例如：Ctrl+Shift+X)
        if (/*event.ctrlKey && event.shiftKey && */event.key.toLowerCase() === '5') {
            event.preventDefault();
            console.log("我是發送源，正在廣播指令...");
            
            // 廣播給所有分頁
            // channel.postMessage({
            //     action: "EXECUTE_CLICK",
            //     type: 'keydown',
            //     key: event.key/*,
            //     ctrlKey: event.ctrlKey,
            //     shiftKey: event.shiftKey*/
            // });
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
}, true);

// 3. 接收端邏輯：監聽廣播
channel.addEventListener('message', async (event) => {
    // const { targetTabIds } = await chrome.storage.local.get('targetTabIds');
    console.log("myTabId is ", myTabId);
    console.log("targetTabIds is ", targetTabIds);
    // 如果我是目標分頁之一
    if (targetTabIds && targetTabIds.includes(myTabId)) {
        console.log("收到指令，我是目標分頁，執行動作！");
        
        // 模擬真實按鍵
        // const keyboardEvent = new KeyboardEvent('keydown', {
        //     key: event.data.key,/*
        //     ctrlKey: event.data.ctrlKey,
        //     shiftKey: event.data.shiftKey,*/
        //     bubbles: true
        // });
        // document.dispatchEvent(keyboardEvent);
        
        // 如果你需要額外的點擊動作，可以在這加入
        // document.querySelector("#my-button")?.click();

        var data = JSON.parse(event.data);
        console.log("message data.type :", data.type);
        console.log("message data :", data);
        document.querySelector("canvas").dispatchEvent(new KeyboardEvent(data.type, data));
    }
});