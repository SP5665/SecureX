// DOM elements
const statusText = document.getElementById("statusText");
const toggleBtn = document.getElementById("toggleDetect");
const openDashboardBtn = document.getElementById("openDashboard");

// Load stored state from chrome storage
chrome.storage.local.get(["detectionEnabled"], (result) => {
    const enabled = result.detectionEnabled ?? true;

    setUI(enabled);
});

// Button: Toggle Detection ON/OFF
toggleBtn.addEventListener("click", () => {
    chrome.storage.local.get(["detectionEnabled"], (result) => {
        const currentState = result.detectionEnabled ?? true;
        const newState = !currentState;

        chrome.storage.local.set({ detectionEnabled: newState });

        setUI(newState);

        // Inform content script about the change
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "toggleDetection",
                enabled: newState
            });
        });
    });
});

// Button: Open CyberShell Dashboard
openDashboardBtn.addEventListener("click", () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("cybershell.html")
    });
});

// Helper UI function
function setUI(enabled) {
    if (enabled) {
        statusText.innerText = "Threat Detection: ON";
        statusText.style.color = "#2ECC71"; // Green
        toggleBtn.innerText = "Turn OFF";
        toggleBtn.style.background = "#ff6b6b"; // Red
    } else {
        statusText.innerText = "Threat Detection: OFF";
        statusText.style.color = "#e67e22"; // Orange
        toggleBtn.innerText = "Turn ON";
        toggleBtn.style.background = "#1E90FF"; // Blue
    }
}
