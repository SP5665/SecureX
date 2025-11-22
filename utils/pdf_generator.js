// pdf_generator.js
// If you prefer centralized generation, expose window.generateCyberReport here.
// This file can be loaded via content_scripts or injected into page.

window.generateCyberReport = async function (reportData) {
  // Load jsPDF if necessary (CDN)
  if (!window.jspdf && !window.jsPDF) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = chrome.runtime.getURL("libs/jspdf.umd.min.js");
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    }).catch(() => {
      throw new Error("Failed to load jsPDF");
    });
  }
  const jsPDF = window.jspdf?.jsPDF || window.jsPDF;
  if (!jsPDF) throw new Error("jsPDF not available");

  const { offender = "unknown", message = "", timestamp = new Date().toISOString(), chatUrl = window.location.href } = reportData;
  const now = new Date();
  const fileName = `CyberReport_${offender.replace(/\s+/g, "_")}_${now.getTime()}.pdf`;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let left = 40;
  let y = 60;
  doc.setFontSize(18);
  doc.text("CyberProtect DM - Threat Report", left, y);
  y += 30;
  doc.setFontSize(11);
  doc.text(`Report generated: ${now.toLocaleString()}`, left, y);
  y += 20;
  doc.text(`Platform: Instagram Web`, left, y);
  y += 18;
  doc.text(`Chat URL:`, left, y);
  doc.text(chatUrl, left + 60, y, { maxWidth: 480 });
  y += 25;
  doc.text(`Offender (username): ${offender}`, left, y);
  y += 18;
  doc.text(`Timestamp (message): ${timestamp}`, left, y);
  y += 22;
  doc.setFontSize(12);
  doc.text("Message:", left, y);
  y += 16;
  const split = doc.splitTextToSize(message, 500);
  doc.setFontSize(10);
  doc.text(split, left, y);
  doc.save(fileName);

  return fileName;
};
