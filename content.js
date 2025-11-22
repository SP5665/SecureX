// Monitor new messages
const observer = new MutationObserver(() => {
    let messages = document.querySelectorAll('.message, .msg, div');  

    messages.forEach(msg => {
        if (!msg.dataset.securexProcessed) {
            msg.dataset.securexProcessed = "true";

            let text = msg.innerText;

            // Send message to threat model
            chrome.runtime.sendMessage(
                { type: "CHECK_THREAT", message: text },
                (response) => {
                    if (response.isThreat) {
                        
                        // Blur message
                        msg.style.filter = "blur(8px)";
                        msg.style.position = "relative";

                        // Add popup button
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
                }
            );
        }
    });
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });