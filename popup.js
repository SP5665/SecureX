document.getElementById("report").onclick = () => {
    chrome.runtime.sendMessage({ type: "REPORT" });
};

document.getElementById("blockDelete").onclick = () => {
    chrome.runtime.sendMessage({ type: "BLOCK_DELETE" });
};