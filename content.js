console.log("🔥 SecureX content script active on:", window.location.href);

// ---- OBSERVER TO WATCH NEW MESSAGES ----
const observer = new MutationObserver(() => scanMessages());
observer.observe(document.body, { childList: true, subtree: true });

// ---- THREAT DETECTION ----
function detectThreat(text) {
    const keywords = [
        "kill", "hurt", "threat", "rape", "attack",
        "i will find you", "i will come", "i will harm you",
        "die", "violence", "blood", "stab"
    ];
    return keywords.some(k => text.toLowerCase().includes(k));
}

// ---- MAIN SCANNER ----
function scanMessages() {
    const messages = document.querySelectorAll("p, span, div");

    messages.forEach(msg => {
        if (msg.dataset.securexProcessed) return;

        const text = msg.innerText?.trim();
        if (!text) return;

        const harmful = detectThreat(text);

        if (harmful) {
            blurMessage(msg, text);
            saveIncident(text);
        }

        msg.dataset.securexProcessed = "true";
    });
}

// ---- BLUR MESSAGE + REVEAL BUTTON ----
function blurMessage(element, text) {
    element.style.filter = "blur(7px)";
    element.style.transition = "0.3s";
    element.style.userSelect = "none";

    const btn = document.createElement("button");
    btn.innerText = "Reveal";
    btn.className = "securex-reveal-btn";

    btn.onclick = () => {
        element.style.filter = "none";
        btn.remove();
    };

    element.insertAdjacentElement("afterend", btn);
}

// ---- SAVE INCIDENT TO STORAGE ----
function saveIncident(text) {
    const incident = {
        content: text,
        url: window.location.href,
        time: new Date().toLocaleString()
    };

    chrome.storage.local.get(["incidents"], data => {
        const arr = data.incidents || [];
        arr.push(incident);
        chrome.storage.local.set({ incidents: arr });
    });
}
