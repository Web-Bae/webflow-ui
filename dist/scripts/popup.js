(() => {
  // src/scripts/popup.ts
  function saveSettings() {
    const fontSizeInput = document.querySelector("#fontSize");
    if (!fontSizeInput)
      return;
    const fontSize = fontSizeInput.value;
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id || !activeTab?.url)
        return;
      let url = new URL(activeTab.url);
      if (url.hostname === "webflow.com" && url.pathname.startsWith("/design/")) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { type: "updateSettings", fontSize },
          () => {
            chrome.storage.sync.set({ fontSize });
          }
        );
      }
    });
  }
  function restoreSettings() {
    const fontSizeInput = document.querySelector("#fontSize");
    if (!fontSizeInput)
      return;
    chrome.storage.sync.get({ fontSize: "11.5px" }, (items) => {
      fontSizeInput.value = items.fontSize;
    });
    fontSizeInput.addEventListener("input", saveSettings);
  }
  document.addEventListener("DOMContentLoaded", restoreSettings);
})();
//# sourceMappingURL=popup.js.map
