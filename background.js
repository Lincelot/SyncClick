// background.js

console.log("Background Service Worker 已啟動");

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//     if (message.action === "REQUEST_SYNC") {
//         // 獲取使用者設定的目標清單
//         const data = await chrome.storage.local.get(['targetTabIds']);
//         const targets = data.targetTabIds || [];
//         console.log("data: ${data}");
//         console.log("targets: ${targets}");
        
//         // 轉發指令給所有目標分頁
//         targets.forEach(tabId => {
//             // 發送訊息給指定的目標分頁
//             chrome.tabs.sendMessage(tabId, {
//                 action: "EXECUTE_CLICK",
//                 selector: message.selector // 這裡之後可以改成動態傳入的 ID
//             }).catch(err => {
//                 console.error(`無法送達分頁 ${tabId}:`, err);
//             });
//         });
//     }
// });
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_TAB_ID") {
        sendResponse({ tabId: sender.tab.id });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_SOURCE_TAB_ID") {
        chrome.storage.local.get(request.key, (data) => {
            sendResponse(data);
        });
        return true; // 保持通道開啟，等待非同步回應
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_TARGET_TAB_IDS") {
        chrome.storage.local.get(request.key, (data) => {
            sendResponse(data);
        });
        return true; // 保持通道開啟，等待非同步回應
    }
});