// background.js
// Handles messages from content scripts and stores report metadata in chrome.storage

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "SAVE_REPORT") {
    const report = msg.report; // { id, offender, snippet, timestamp, filename }
    chrome.storage.local.get({ reports: [] }, (res) => {
      const reports = res.reports || [];
      reports.unshift(report);
      chrome.storage.local.set({ reports }, () => {
        sendResponse({ status: "OK" });
      });
    });
    // Return true to indicate async sendResponse
    return true;
  } else if (msg?.type === "GET_REPORTS") {
    chrome.storage.local.get({ reports: [] }, (res) => {
      sendResponse({ reports: res.reports || [] });
    });
    return true;
  } else if (msg?.type === "CLEAR_REPORTS") {
    chrome.storage.local.set({ reports: [] }, () => sendResponse({ status: "OK" }));
    return true;
  }
});
