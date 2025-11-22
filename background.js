// background.js - robust MV3 service worker for SecureX

const THREAT_KEYWORDS = [
  "kill","rape","murder","blackmail","beat you","hurt you","leak","suicide","expose"
];

// helper - safe detection
function detectThreat(text) {
  if (!text) return false;
  const lower = String(text).toLowerCase();
  return THREAT_KEYWORDS.some(k => lower.includes(k));
}

self.addEventListener('install', (ev) => {
  console.log('SecureX service worker installed');
});

self.addEventListener('activate', (ev) => {
  console.log('SecureX service worker activated');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  try {
    if (!req || !req.type) {
      sendResponse({ isThreat: false });
      return; // no async reply required
    }

    if (req.type === "CHECK_THREAT") {
      // Synchronous reply (fast)
      const isThreat = detectThreat(req.message);
      sendResponse({ isThreat });
      // return false (or nothing) is OK for synchronous sendResponse
      return; // done
    }

    if (req.type === "OPEN_OPTIONS") {
      // open popup window for user choices
      const query = `?msg=${encodeURIComponent(req.message||'')}&sender=${encodeURIComponent(req.sender||'Unknown')}`;
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html") + query,
        type: "popup",
        width: 380,
        height: 520
      });
      sendResponse({ ok: true });
      return;
    }

    if (req.type === "SEND_REPORT") {
      // Example: accept blob or details and forward to remote API (async)
      // Keep this simple and return immediately; perform async work without blocking
      (async () => {
        try {
          // example: await fetch('https://your-backend/report', { method:'POST', body: req.payload });
          console.log('SecureX: pretend send report', req.payload||req);
        } catch(e) {
          console.error('SecureX: failed to send report', e);
        }
      })();

      sendResponse({ ok: true });
      return;
    }

    // default
    sendResponse({ isThreat: false });
  } catch (err) {
    console.error('SecureX background error:', err);
    try { sendResponse({ isThreat: false, error: String(err) }); } catch(e) {}
  }
});
