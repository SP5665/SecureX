// Mutation Observer - monitors new messages
const observer = new MutationObserver(() => {
    let messages = document.querySelectorAll("div, .message, .msg");

    messages.forEach(msg => {
        if (msg.dataset.securexProcessed) return;
        msg.dataset.securexProcessed = "true";

        let text = msg.innerText?.trim();
        if (!text) return;

        chrome.runtime.sendMessage(
            { type: "CHECK_THREAT", message: text },
            (response) => {

                // SAFETY CHECK (prevents "Extension context invalidated")
                if (chrome.runtime.lastError || !response) {
                    console.warn("SecureX: Background not ready.");
                    return;
                }

                if (!response.isThreat) return;

                // Blur message
                msg.style.filter = "blur(8px)";
                msg.style.position = "relative";

                // Create button
                let btn = document.createElement("button");
                btn.innerText = "⚠ Threat Detected - Options";
                btn.className = "securex-btn";

                btn.onclick = () => {
                    chrome.runtime.sendMessage({
                        type: "OPTIONS",
                        message: text
                    });
                };

                msg.appendChild(btn);
            }
        );
    });
});

observer.observe(document.body, { childList: true, subtree: true });
