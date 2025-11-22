setInterval(() => {
    scanMessages();
}, 1500);


function scanMessages() {
    let selectors = [
        "p", 
        "span",
        "div",
        // Instagram message bubble selectors
        "div._acrb",  // sent messages
        "div._acrc",  // received messages
        "h1, h2, h3"  // fallback
    ];

    const messages = document.querySelectorAll(selectors.join(","));

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
