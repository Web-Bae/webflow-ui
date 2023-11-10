import { selectors } from "./constants";

const DEBUG = true;
let fontSize: string;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "updateSettings") {
    fontSize = request.fontSize;
    applyStylesToPage(fontSize);
  }
  sendResponse({ success: true });
});

const waitForWebflowLoad = setInterval(() => {
  if (
    document.querySelectorAll<HTMLDivElement>(selectors.TOP_BAR_SPACE_CLASS)[1]
  ) {
    clearInterval(waitForWebflowLoad);
    chrome.storage.sync.get({ fontSize: "11.5px" }, (items) => {
      fontSize = items.fontSize;
      DEBUG && console.log({ fontSize });
      applyStylesToPage(fontSize);
    });
  }
}, 2000);

function applyStylesToPage(fontSize: string) {
  const css = generateCSS(fontSize);
  chrome.runtime.sendMessage({ action: "insertCSS", css }, (response) => {
    DEBUG && console.log({ response });
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    }
  });
}

function generateCSS(fontSize: string): string {
  return `
    #right-sidebar,
    #react-navigator > div,
    #right-sidebar .tabs span {
      font-size: ${fontSize}px;
    }
  `;
}
