(() => {
  // src/scripts/background.ts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "insertCSS") {
      console.log({ message });
      chrome.scripting.insertCSS(
        {
          target: { tabId: sender?.tab?.id || 1 },
          css: message.css
        },
        () => {
          sendResponse({ success: true });
        }
      );
      return true;
    }
    if (message.action === "removeCSS") {
      chrome.scripting.removeCSS(
        {
          target: { tabId: sender?.tab?.id || 1 },
          css: message.css
        },
        () => {
          sendResponse({ success: true });
        }
      );
      return true;
    }
  });
})();
//# sourceMappingURL=background.js.map
