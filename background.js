// PDF Report Generator
function generatePDF(threatMessage, senderInfo = "Unknown User") {
    // Load jsPDF library dynamically
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

    script.onload = () => {
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        doc.setFont("Helvetica", "normal");

        doc.setFontSize(18);
        doc.text("SecureX Cyber Threat Report", 20, 20);

        doc.setFontSize(12);
        doc.text("Generated Automatically by SecureX", 20, 30);
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, 40);

        doc.setFontSize(14);
        doc.text("Perpetrator Information:", 20, 60);

        doc.setFontSize(12);
        doc.text(`Sender: ${senderInfo}`, 20, 70);

        doc.setFontSize(14);
        doc.text("Threat Message:", 20, 90);

        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(threatMessage, 170), 20, 100);

        doc.setFontSize(14);
        doc.text("Severity:", 20, 140);

        doc.setFontSize(12);
        doc.text("HIGH – Requires immediate review.", 20, 150);

        // Save PDF
        doc.save("SecureX_Report.pdf");

        // Optionally send to cyber crime API endpoint
        // sendToCyberCrime(doc.output("blob"));
    };

    document.body.appendChild(script);
}
