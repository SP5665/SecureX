chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "exportIncidents") {
        chrome.storage.local.get(["incidents"], data => {
            const incidents = data.incidents || [];

            let report = "=== SecureX Threat Report ===\n\n";
            incidents.forEach((i, index) => {
                report += `${index + 1}. ${i.content}\n`;
                report += `   Time: ${i.time}\n`;
                report += `   URL:  ${i.url}\n\n`;
            });

            sendResponse({ text: report });
        });

        return true; // async response
    }
});
