// Background service worker for ZenReader extension
// Opens the reader in a new tab when the extension icon is clicked

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});
