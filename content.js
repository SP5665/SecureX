// content.js

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
    "hurt you","stab you","beat you","attack you","burn you"
];

const SCAN_INTERVAL_MS = 1500;

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
    const nodes = Array.from(document.querySelectorAll("div[role='button'] span, div[role='dialog'] span, div[role='main'] span"));
    return nodes.filter(n => n.innerText && n.innerText.trim().length > 0);
}

// Find sender (heuristic)
function findSenderForNode(node) {
    let el = node;
    for (let i = 0; i < 6 && el; i++) {
        const possible = el.closest("div[role='listitem'], div[role='row'], li, div");
        if (!possible) { el = el.parentElement; continue; }
        const nameNode = possible.querySelector("a, strong, h3, span[dir='auto']");
        if (nameNode && nameNode.innerText && nameNode.innerText.length < 60) return nameNode.innerText.trim();
        el = possible.parentElement;
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
    blurred.innerText = originalText;

    const btnContainer = document.createElement("span");
    btnContainer.className = "cyber-report-banner";

    const revealBtn = document.createElement("button");
    revealBtn.className = "reveal-btn";
    // revealBtn.innerText = "Show";
    revealBtn.addEventListener("click", () => {
        blurred.classList.remove("blurred-message");
        revealBtn.remove();
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
            }).catch(err => {
                console.error("PDF generation failed", err);
                alert("Failed to generate PDF.");
            });
        });
    });

    btnContainer.appendChild(revealBtn);
    btnContainer.appendChild(reportBtn);

    wrapper.appendChild(blurred);
    wrapper.appendChild(btnContainer);

    node.innerHTML = "";
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
setInterval(scanAndProcess, SCAN_INTERVAL_MS);

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