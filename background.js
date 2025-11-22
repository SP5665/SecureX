// background.js - FIXED AND CLEAN

const THREAT_KEYWORDS = [
  "kill", "rape", "murder", "blackmail", "beat you", "hurt you", "leak", "suicide", "expose"
];

function detectThreat(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return THREAT_KEYWORDS.some(k => lower.includes(k));
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  try {
    if (!req || !req.type) {
      sendResponse({ isThreat: false });
      return;
    }

    // CHECK THREAT
    if (req.type === "CHECK_THREAT") {
      sendResponse({ isThreat: detectThreat(req.message) });
      return;
    }

    // OPEN POPUP FOR OPTIONS
    if (req.type === "OPTIONS") {
      const query = `?msg=${encodeURIComponent(req.message)}`;

      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html") + query,
        type: "popup",
        width: 380,
        height: 520
      });

      sendResponse({ ok: true });
      return;
    }

    // SEND REPORT (FAKE API CALL)
    if (req.type === "SEND_REPORT") {
      console.log("Report sent:", req.payload);
      sendResponse({ ok: true });
      return;
    }

  } catch (e) {
    console.error("Error:", e);
    sendResponse({ isThreat: false });
  }
});
