from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from PIL import Image
import base64
from io import BytesIO
import time
import os

def create_pdf(offender, message, timestamp, chatUrl, snippet, screenshot_base64):
    print("➡ Starting PDF generation...")

    filename = f"report_{int(time.time())}.pdf"
    filepath = os.path.abspath(filename)

    # Decode screenshot
    try:
        header, encoded = screenshot_base64.split(",", 1)
        img_data = base64.b64decode(encoded)
        img = Image.open(BytesIO(img_data))
        print("✔ Screenshot decoded")
    except Exception as e:
        print("❌ Screenshot decode failed:", e)
        img = None

    # Create PDF
    try:
        c = canvas.Canvas(filepath, pagesize=A4)
        width, height = A4

        # Title
        c.setFont("Helvetica-Bold", 18)
        c.drawString(40, height - 50, "SECURE X THREAT REPORT")

        # Text block
        c.setFont("Helvetica", 11)
        text_y = height - 90
        lines = [
            f"Offender: {offender}",
            f"Message: {message}",
            f"Time: {timestamp}",
            f"Chat URL: {chatUrl}",
        ]

        for line in lines:
            c.drawString(40, text_y, line)
            text_y -= 20

        # Add screenshot if available
        if img:
            print("➡ Adding screenshot image...")
            report_img = ImageReader(BytesIO(img_data))

            # Auto-scale to fit A4 width
            img_w, img_h = img.size
            scale = (width - 80) / img_w
            new_w = img_w * scale
            new_h = img_h * scale

            c.drawImage(report_img, 40, text_y - new_h - 20, width=new_w, height=new_h)

        c.save()
        print("✔ PDF saved successfully:", filepath)
        return filename

    except Exception as e:
        print("❌ PDF generation error:", e)
        return None
