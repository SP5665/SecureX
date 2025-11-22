function scanMessages() {
    let selectors = [
        "p",
        "span",
        "div",
        "div._acrb",  // Instagram sent messages
        "div._acrc",  // Instagram received messages
        "h1, h2, h3"
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
