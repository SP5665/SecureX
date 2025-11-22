const logs = document.getElementById("logs");

chrome.storage.local.get(["incidents"], data => {
    const arr = data.incidents || [];

    if (arr.length === 0) {
        logs.innerHTML = "<p>No threats detected yet.</p>";
        return;
    }

    arr.forEach(i => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `<b>${i.time}</b><br>${i.content}<br><small>${i.url}</small>`;
        logs.appendChild(div);
    });
});

document.getElementById("exportBtn").onclick = () => {
    chrome.runtime.sendMessage({ action: "exportIncidents" }, response => {
        const blob = new Blob([response.text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "SecureX_Report.txt";
        a.click();
    });
};
