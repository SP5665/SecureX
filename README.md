# SecureX - CyberProtect DM

SecureX is a Chrome extension designed to enhance user safety on Instagram Web by detecting threatening messages in direct messages (DMs) and generating detailed reports for cybercrime authorities. The extension provides an interactive interface to alert users about potential threats, allows users to reveal blurred messages securely, and generates PDF reports with a single click.

---

## Features

- **Threat Detection:**  
  Scans Instagram DMs for predefined threat keywords such as harassment, threats of violence, or demands for money.

- **Message Blurring:**  
  Automatically blurs messages detected as threats to prevent accidental exposure.

- **Interactive Reveal:**  
  Users can click on a blurred message to reveal it for safe review.

- **Report Generation:**  
  Generates a PDF report containing the message, sender information, timestamp and chat UR.

- **Redirect to Cybercrime Portal:**  
  After generating the report, the extension redirects users to the [Cybercrime Reporting Website](https://cybercrime.gov.in/) for further action.

- **Local Storage of Reports:**  
  Saves metadata of all generated reports locally using Chrome storage.
---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **PDF Generation:** jsPDF (UMD)  
- **Chrome Extension APIs:** chrome.runtime, chrome.storage, chrome.runtime.getURL  
- **Storage:** chrome.storage.local for saving report metadata  
- **External Integration:** Redirects to Cybercrime.gov.in after generating reports  

---

## Installation

1. Clone or download this repository.  
2. Open Chrome and navigate to `chrome://extensions/`.  
3. Enable **Developer Mode** (top right).  
4. Click **Load unpacked** and select the project folder.  
5. Open Instagram Web, and SecureX will start monitoring DMs automatically.

---

## Usage

1. Log in to Instagram Web and navigate to your Direct Messages.  
2. Threat messages will appear blurred with a SecureX logo.  
3. Click on a blurred message to reveal it.  
4. Click the **Report** button to generate a PDF report.  
5. After the report is generated, you will be redirected to the Cybercrime Reporting website.  

---

## How It Works

1. **Content Script:**  
   - Injects jsPDF library into Instagram Web.  
   - Scans messages periodically for threat keywords.  
   - Blurs threat messages and adds interactive controls.  

2. **Background Script:**  
   - Receives report metadata from the content script.  
   - Saves the data in `chrome.storage.local`.  

3. **PDF Report:**  
   - Includes sender username, message, timestamp and chat URL.  
   - Automatically saved with a timestamped filename.  

---
## Author

Developers of SecureX 

Srajal Sahu
Srishti Pandey
Shubhi Agarwal
Satvik Singh

---