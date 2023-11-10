(() => {
  // src/scripts/constants.ts
  var selectors = {
    TOP_BAR_SPACE_CLASS: ".top-bar-space",
    RIGHT_SIDEBAR_TEXT: "#react-navigator > div, #right-sidebar .tabs span"
  };

  // src/scripts/content.ts
  var DEBUG = true;
  var fontSize;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "updateSettings") {
      fontSize = request.fontSize;
      applyStylesToPage(fontSize);
    }
    sendResponse({ success: true });
  });
  var waitForWebflowLoad = setInterval(() => {
    if (document.querySelectorAll(selectors.TOP_BAR_SPACE_CLASS)[1]) {
      clearInterval(waitForWebflowLoad);
      chrome.storage.sync.get({ fontSize: "11.5px" }, (items) => {
        fontSize = items.fontSize;
        DEBUG && console.log({ fontSize });
        applyStylesToPage(fontSize);
      });
    }
  }, 2e3);
  function applyStylesToPage(fontSize2) {
    const css = generateCSS(fontSize2);
    chrome.runtime.sendMessage({ action: "insertCSS", css }, (response) => {
      DEBUG && console.log({ response });
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }
  function generateCSS(fontSize2) {
    return `
    #right-sidebar,
    #react-navigator > div,
    #right-sidebar .tabs span {
      font-size: ${fontSize2}px;
    }
  `;
  }
})();
//# sourceMappingURL=content.js.map
