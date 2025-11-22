// content.js

// Tracks processed message nodes safely
const processedNodes = new WeakSet();

// Inject jsPDF into the page
const jsPDFScript = document.createElement("script");
jsPDFScript.src = chrome.runtime.getURL("libs/jspdf.umd.min.js");
jsPDFScript.onload = () => {
    console.log("jsPDF Loaded:", window.jspdf);
};
(document.head || document.documentElement).appendChild(jsPDFScript);

// Threat keywords
const KEYWORDS = [
    "kill you","i will kill","i'll kill","murder you","i will murder","i'll murder","die","i'll find you","i will find you","i'll come","i will come",
    "send money","pay me","transfer","or else","leak your pics","i have your pictures","leak your photos","pay up",
    "rape you","i will rape","i'll rape","sexual","expose yourself","send nudes or else",
    "hurt you","stab you","beat you","attack you","burn you",
];

const SCAN_INTERVAL_MS = 5600;

// Check if text is a threat
function isThreatText(text) {
    if (!text) return { threat: false, score: 0, reasons: [] };
    const t = text.toLowerCase();
    const matches = [];
    for (const k of KEYWORDS) {
        if (t.includes(k)) matches.push(k);
    }
    return { threat: matches.length > 0, score: Math.min(1, matches.length / 3), reasons: matches };
}

// Find message nodes in Instagram DMs
function findMessageNodes() {
    const possibleNodes = [
        "div[role='none'] span",      // Instagram message spans
        "div.x1lliihq span",          // message text spans
        "div.xz9dl7a span",           // fallback for IG updates
        "div[dir='auto'] span"        // often used for message text
    ];

    const nodes = Array.from(document.querySelectorAll(possibleNodes.join(",")));

    return nodes.filter(n => 
        n.innerText && 
        n.innerText.trim().length > 0 &&
        !n.dataset.cyberProcessed
    );
}


// Find sender (heuristic)
function findSenderForNode(node) {
    const messageRow = node.closest("div[role='listitem'], div[role='row']");
    if (!messageRow) return "Unknown";

    // Get the sender link (profile link)
    const senderLink = messageRow.querySelector("a[href^='/']");
    if (senderLink && senderLink.innerText.trim().length > 0) {
        return senderLink.innerText.trim();
    }

    return "Unknown";
}


// Find timestamp (fallback)
function findTimestampForNode(node) {
    return new Date().toISOString();
}

// Inject blur and buttons
function injectControlsFor(node) {
    if (node.dataset.cyberProcessed) return;
    node.dataset.cyberProcessed = "1";

    const originalText = node.innerText;
    const wrapper = document.createElement("span");
    wrapper.className = "cyber-message-wrapper";

    const blurred = document.createElement("span");
    blurred.className = "blurred-message";
   // blurred.innerText = originalText;

    const btnContainer = document.createElement("span");
    btnContainer.className = "cyber-report-banner";
const revealBtn = document.createElement("button");
revealBtn.className = "reveal-btn";
revealBtn.innerText = "Reveal";

    // Toggle blur when clicking the message itself
    blurred.addEventListener("click", () => {
        blurred.classList.remove("blurred-message");
    });

    const reportBtn = document.createElement("button");
    reportBtn.className = "report-btn";
    // reportBtn.innerText = "Report";
    reportBtn.addEventListener("click", () => {
        const sender = findSenderForNode(node);
        const timestamp = findTimestampForNode(node);
        const snippet = originalText.length > 300 ? originalText.slice(0, 300) + "..." : originalText;

        const reportData = {
            offender: sender,
            message: originalText,
            timestamp,
            chatUrl: window.location.href,
            snippet
        };

        
        // Wait for jsPDF to load
        waitForJsPDF().then(() => {
            window.generateCyberReport(reportData).then((filename) => {
                chrome.runtime.sendMessage({
                    type: "SAVE_REPORT",
                    report: {
                        id: "rep_" + Date.now(),
                        offender: sender,
                        snippet,
                        timestamp,
                        filename
                    }
                });
                alert("Report generated: " + filename);

                // Redirect to cyber crime reporting website
                window.open("https://cybercrime.gov.in/", "_blank"); 
            }).catch(err => {
                console.error("PDF generation failed", err);
                alert("Failed to generate PDF.");
            });
        });
    });

    // btnContainer.appendChild(revealBtn);
    btnContainer.appendChild(reportBtn);

    wrapper.appendChild(blurred);
    wrapper.appendChild(btnContainer);
  //==========pop up feature==========
  // === ADD POPUP HERE ===

// Create popup container
const popup = document.createElement("div");
popup.className = "cyber-action-popup";
popup.style.display = "none";

// Popup buttons
const blockBtn = document.createElement("button");
blockBtn.innerText = "Block Sender";
blockBtn.className = "popup-btn block";

const saveBtn = document.createElement("button");
saveBtn.innerText = "Save Evidence";
saveBtn.className = "popup-btn save";

const deleteBtn = document.createElement("button");
deleteBtn.innerText = "Delete Message";
deleteBtn.className = "popup-btn delete";

// Append popup buttons
popup.appendChild(blockBtn);
popup.appendChild(saveBtn);
popup.appendChild(deleteBtn);

// Append popup to wrapper
wrapper.appendChild(popup);

// Toggle popup when reveal button is clicked
revealBtn.addEventListener("click", () => {
    popup.style.display = popup.style.display === "flex" ? "none" : "flex";
});

// BLOCK SENDER
blockBtn.addEventListener("click", () => {
    const offender = findSenderForNode(node);
    alert("Sender blocked: " + offender);
    popup.style.display = "none";
});

// SAVE EVIDENCE
saveBtn.addEventListener("click", () => {
    const sender = findSenderForNode(node);
    const timestamp = findTimestampForNode(node);
    const snippet = originalText.length > 300 ? originalText.slice(0, 300) + "..." : originalText;

    const reportData = {
        offender: sender,
        message: originalText,
        timestamp,
        chatUrl: window.location.href,
        snippet
    };

    waitForJsPDF().then(() => {
        window.generateCyberReport(reportData).then((filename) => {
            alert("Evidence saved: " + filename);
            popup.style.display = "none";
        });
    });
});

// DELETE MESSAGE
deleteBtn.addEventListener("click", () => {
    node.remove();
    popup.style.display = "none";
});

      while (node.firstChild) node.firstChild.remove();
    node.appendChild(wrapper);
  
}

// Scan loop
function scanAndProcess() {
    const nodes = findMessageNodes();
    for (const node of nodes) {
        if (node.dataset.cyberProcessed) continue;
        if (isThreatText(node.innerText).threat) injectControlsFor(node);
    }
}

// Wait for jsPDF
function waitForJsPDF() {
    return new Promise((resolve, reject) => {
        const check = setInterval(() => {
            if (window.jspdf && window.jspdf.jsPDF) {
                clearInterval(check);
                resolve();
            }
        }, 100);
        setTimeout(() => reject("jsPDF load timeout"), 5000);
    });
}

// Start scanning periodically
// Run immediately once
function startControlledLoop() {
    // Run immediately
    scanAndProcess();
   
      setTimeout(() => {
        startControlledLoop();
    }, 1500);  
    // Then wait 2 hours (7200000 ms)
    setTimeout(() => {
        startControlledLoop();
    }, 72000);
}

// Start the loop
startControlledLoop();


// Listen to messages from popup
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "generatePDF") {
        const selectedThreat = document.querySelector(".cyber-threat");
        if (!selectedThreat) return alert("No threat message found.");
        const reportData = {
            offender: document.querySelector("header h2")?.innerText || "unknown",
            message: selectedThreat.innerText,
            timestamp: new Date().toISOString(),
            chatUrl: window.location.href
        };
        waitForJsPDF().then(() => window.generateCyberReport(reportData));
    }
});