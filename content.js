// ---------------------------
// SecureX – Content Script
// ---------------------------

// STEP 1: Observe the page for new messages
const observer = new MutationObserver(() => {
    scanMessages();
});

observer.observe(document.body, { childList: true, subtree: true });

// ---------------------------
// STEP 2: Scan messages
// ---------------------------
function scanMessages() {
    // Change this selector based on your target website
    const messages = document.querySelectorAll(".message, .text, p, span");

    messages.forEach(msg => {
        if (msg.dataset.securexProcessed) return;

        const text = msg.innerText.trim();
        if (!text) return;

        // STEP 3: Run message through AI threat detector (placeholder)
        const isHarmful = detectThreat(text);

        if (isHarmful) {
            blurMessage(msg, text);
        }

        msg.dataset.securexProcessed = "true";
    });
}

// ---------------------------
// STEP 3: Threat-detection logic (simple version)
// Replace with real AI later
// ---------------------------
function detectThreat(text) {
    const threatKeywords = [
        "kill", "hurt", "threat", "rape", "attack",
        "i will find you", "i will come", "i will harm you",
        "die", "violence"
    ];

    return threatKeywords.some(word =>
        text.toLowerCase().includes(word)
    );
}

// ---------------------------
// STEP 4: Blur harmful message
// ---------------------------
function blurMessage(element, text) {
    element.style.filter = "blur(6px)";
    element.style.transition = "0.2s";
    element.dataset.securexOriginal = text;

    // Add reveal button
    const button = document.createElement("button");
    button.innerText = "Reveal Safely";
    button.style.marginLeft = "8px";
    button.style.padding = "2px 6px";
    button.style.fontSize = "12px";
    button.style.cursor = "pointer";
    button.style.border = "1px solid #555";
    button.style.borderRadius = "4px";
    button.style.background = "#ffc";
    button.style.zIndex = "9999";

    button.onclick = () => {
        element.style.filter = "none";
        button.remove();
    };

    element.insertAdjacentElement("afterend", button);

    // Log harmful message for reporting
    saveIncident(text);
}

// ---------------------------
// STEP 5: Store harmful messages for PDF report
// ---------------------------
function saveIncident(text) {
    const incident = {
        content: text,
        url: window.location.href,
        timestamp: new Date().toISOString()
    };

    chrome.storage.local.get(["securexIncidents"], (data) => {
        const incidents = data.securexIncidents || [];
        incidents.push(incident);

        chrome.storage.local.set({ securexIncidents: incidents });
    });
}
