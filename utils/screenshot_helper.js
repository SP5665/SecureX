// utils/screenshot_helper.js

// This function captures a screenshot of a DOM element and returns a Base64 PNG
export async function captureScreenshot(element) {
    try {
        if (!element) {
            console.error("captureScreenshot: No element provided");
            return null;
        }

        // html2canvas MUST be loaded via manifest.json content_scripts
        const canvas = await html2canvas(element, {
            useCORS: true,
            scale: 2
        });

        const imageData = canvas.toDataURL("image/png");

        // Save to chrome local storage
        chrome.storage.local.set({ "last_screenshot": imageData }, () => {
            console.log("Screenshot saved to local storage.");
        });

        return imageData;

    } catch (error) {
        console.error("Screenshot capture failed:", error);
        return null;
    }
}
