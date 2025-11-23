// content.js

// Tracks processed message nodes safely
const processedNodes = new WeakSet();

// Threat keywords
const KEYWORDS = [
    "kill you","i will kill","i'll kill","murder you","i will murder","i'll murder","die",
    "i'll find you","i will find you","i'll come","i will come",
    "send money","pay me","transfer","or else","leak your pics",
    "i have your pictures","leak your photos","pay up",
    "rape you","i will rape","i'll rape","sexual","expose yourself",
    "send nudes or else","hurt you","stab you","beat you","attack you","burn you",
];

// Check if text is a threat
function isThreatText(text) {
    if (!text) return false;
    const t = text.toLowerCase();
    return KEYWORDS.some(k => t.includes(k));
}

// Find message nodes in Instagram DMs
function findMessageNodes() {
    const selectors = [
        "div[role='none'] span",
        "div.x1lliihq span",
        "div.xz9dl7a span",
        "div[dir='auto'] span"
    ];
    return Array.from(document.querySelectorAll(selectors.join(",")))
        .filter(n => n.innerText && n.innerText.trim().length > 0 && !n.dataset.cyberProcessed);
}

// Simple sender finder
function findSenderForNode(node) {
    const row = node.closest("div[role='listitem'], div[role='row']");
    if (!row) return "Unknown";
    const link = row.querySelector("a[href^='/']");
    return link ? link.innerText.trim() : "Unknown";
}

// Timestamp fallback
function findTimestampForNode(node) {
    return new Date().toISOString();
}

// ================================
// MAIN: Inject blur + reveal + alert
// ================================
function injectControlsFor(node) {
    if (node.dataset.cyberProcessed) return;
    node.dataset.cyberProcessed = "1";

    const originalText = node.innerText;

    // WRAPPER
    const wrapper = document.createElement("span");
    wrapper.className = "cyber-message-wrapper";

    // BLURRED TEXT (using inline style for reliability)
    const blurred = document.createElement("span");
    blurred.style.filter = "blur(5px)";  // Blur the text
    blurred.style.userSelect = "none";   // Prevent selection while blurred
    blurred.innerText = originalText;

    // REVEAL BUTTON
    const revealBtn = document.createElement("button");
    revealBtn.className = "reveal-btn";
   // revealBtn.innerText = "Reveal";

    // REPORT BUTTON
    const reportBtn = document.createElement("button");
    reportBtn.className = "report-btn";
   // reportBtn.innerText = "Report";

    const btnContainer = document.createElement("span");
    btnContainer.className = "cyber-report-banner";
    btnContainer.appendChild(revealBtn);
    btnContainer.appendChild(reportBtn);

    // ================================
    // ✔ FIXED UNBLUR FUNCTION
    // ================================
 revealBtn.addEventListener("click", () => {
        // CHANGE: Added debugging console logs to verify the unblur process
        console.log("Reveal button clicked - attempting to unblur");  // Debugging log (NEW)
        // ---- UNBLUR THE MESSAGE ----
        blurred.style.filter = "none";  // Remove blur (this should unblur the text)
        blurred.style.userSelect = "auto";  // Allow selection now
        console.log("Blur removed, text should be visible now"); 
        // ---- UNBLUR THE MESSAGE ----
  

        // ---- ALERT MENU ----
        const choice = prompt(
            "⚠️ Threatening content revealed.\n\nChoose an action:\n" +
            "1 = Block Sender\n" +
            "2 = Save Evidence\n" +
            "3 = Delete Message\n\n" +
            "Enter 1, 2, or 3:"
        );

        if (choice === "1") {
            alert("Sender blocked (simulation only).");
        } else if (choice === "2") {
            const sender = findSenderForNode(node);
            const timestamp = findTimestampForNode(node);
            alert("Evidence saved (simulation).");
        } else if (choice === "3") {
            node.remove();
        } else {
            // no action
        }
    });

    // ================================
    // REPORT BUTTON FUNCTIONALITY
    // ================================
    reportBtn.addEventListener("click", () => {
        const sender = findSenderForNode(node);
        const timestamp = findTimestampForNode(node);
        alert(`Message reported to authorities (simulation).\nSender: ${sender}\nTimestamp: ${timestamp}`);
    });

    // Add to wrapper
    wrapper.appendChild(blurred);
    wrapper.appendChild(btnContainer);

    // Replace original message
    while (node.firstChild) node.firstChild.remove();
    node.appendChild(wrapper);
}

// Scan loop
function scanAndProcess() {
    const nodes = findMessageNodes();
    for (const node of nodes) {
        if (isThreatText(node.innerText)) {
            injectControlsFor(node);
        }
    }
}

// Start scanning
setInterval(scanAndProcess, 1500);
scanAndProcess();
