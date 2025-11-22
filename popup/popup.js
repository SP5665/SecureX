// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleDetection");
  const statusText = document.getElementById("statusText");
  const reportsList = document.getElementById("reportsList");
  const clearBtn = document.getElementById("clearReports");

  // load stored toggle state (if you implement it later). For now it defaults to checked.
  chrome.storage.local.get({ detectionEnabled: true }, (res) => {
    toggle.checked = !!res.detectionEnabled;
    statusText.innerText = toggle.checked ? "ON" : "OFF";
  });

  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    statusText.innerText = enabled ? "ON" : "OFF";
    chrome.storage.local.set({ detectionEnabled: enabled });
    // Optionally, you can send a runtime message to content scripts to pause scanning.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "SET_DETECTION", enabled });
      }
    });
  });

  function refreshReports() {
    chrome.runtime.sendMessage({ type: "GET_REPORTS" }, (res) => {
      const reports = res?.reports || [];
      reportsList.innerHTML = "";
      if (reports.length === 0) {
        reportsList.innerHTML = "<li>No reports yet</li>";
        return;
      }
      for (const r of reports) {
        const li = document.createElement("li");
        li.innerText = `${r.offender} — ${new Date(r.timestamp).toLocaleString()}`;
        reportsList.appendChild(li);
      }
    });
  }

  clearBtn.addEventListener("click", () => {
    if (!confirm("Clear all saved report history?")) return;
    chrome.runtime.sendMessage({ type: "CLEAR_REPORTS" }, (res) => {
      refreshReports();
    });
  });

  refreshReports();

  document.getElementById("generatePdfBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "generatePDF" });
    });
});

});
