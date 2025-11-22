// Basic keyword model
const THREAT_KEYWORDS = [
  "kill", "rape", "murder", "blackmail",
  "beat you", "hurt you", "leak", "suicide"
];

// LISTEN FOR MESSAGES FROM content.js
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {

    if (req.type === "CHECK_THREAT") {
        let lower = req.message.toLowerCase();
        
        let isThreat = THREAT_KEYWORDS.some(word => lower.includes(word));

        sendResponse({ isThreat });
        return true;
    }

    if (req.type === "OPEN_OPTIONS") {
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html") + 
                 `?msg=${encodeURIComponent(req.message)}&sender=${req.sender}`,
            type: "popup",
            width: 380,
            height: 500
        });
    }
});
