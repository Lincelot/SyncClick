// 初始化：當 popup 畫面打開時執行
document.addEventListener('DOMContentLoaded', async () => {
  const sourceList = document.getElementById('sourceTabList');
  const targetList = document.getElementById('targetTabList');

  // 1. 取得所有分頁
  const tabs = await chrome.tabs.query({});

  // 2. 讀取之前的狀態 (開關、發送源、目標清單)
  const data = await chrome.storage.session.get(['enabled', 'sourceTabId', 'targetTabIds']);

  // 初始化開關狀態
  document.getElementById('masterSwitch').checked = data.enabled || false;

  tabs.forEach(tab => {
    // 建立發送源 (Radio)
    const radio = createRadio('sourceGroup', tab.id, tab.title, data.sourceTabId == tab.id);
    sourceList.appendChild(radio);

    // 建立目標分頁 (Checkbox)
    const checkbox = createCheckbox('targetGroup', tab.id, tab.title, data.targetTabIds?.includes(tab.id));
    targetList.appendChild(checkbox);
  });
});

// 事件監聽：當設定改變時自動儲存
document.addEventListener('change', async (e) => {
  if (e.target.id === 'masterSwitch') {
    await chrome.storage.session.set({ enabled: e.target.checked });
    console.log("e.target.id : ", e.target.id);
    if (e.target.checked) {
      console.log("e.target.checked is true : ", e);
      const sessionData = await chrome.storage.session.get(["sourceTabId", "targetTabIds"]);
      const sourceTabId = sessionData.sourceTabId;
      const targetTabIds = sessionData.targetTabIds || [];

      if (sourceTabId) {
        chrome.tabs.sendMessage(sourceTabId, { action: "START_KEYBOARD_BROADCAST" }, response => {
          console.log("onStartKeybardBroadcast : " + response.status);
        });
      }
      for (const tabId of targetTabIds) {
        chrome.tabs.sendMessage(tabId, { action: "START_MESSAGE_RECEIVER" }, response => {
          console.log("onStartMessageReceiver : " + response.status);
        });
      }
    } else {
      console.log("e.target.checked is false : ", e);
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { action: "STOP_SYNC" }, response => {
          if (chrome.runtime.lastError){
            console.log("onStopSync : fail - " + chrome.runtime.lastError.message);
          } else{
            console.log("onStopSync : " + response.status);
          }
        })
      }
    }
  } else if (e.target.name === 'sourceGroup') {
    console.log("e.target.name with sourceGroup : ", e.target.name);
    await chrome.storage.session.set({ sourceTabId: parseInt(e.target.value) });
  } else if (e.target.name === 'targetGroup') {
    console.log("e.target.name with targetGroup : ", e.target.name);
    // 收集所有被勾選的目標
    const checked = Array.from(document.querySelectorAll('input[name="targetGroup"]:checked'))
      .map(el => parseInt(el.value));
    await chrome.storage.session.set({ targetTabIds: checked });
  }
});

// Helper 函式：建立 UI 元件
function createRadio(name, id, title, checked) {
  const div = document.createElement('div');
  div.className = 'tab-item';
  div.innerHTML = `<input type="radio" name="${name}" value="${id}" ${checked ? 'checked' : ''}> ${title}`;
  return div;
}

function createCheckbox(name, id, title, checked) {
  const div = document.createElement('div');
  div.className = 'tab-item';
  div.innerHTML = `<input type="checkbox" name="${name}" value="${id}" ${checked ? 'checked' : ''}> ${title}`;
  return div;
}