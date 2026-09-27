let pollInterval;

document.getElementById("scrapeBtn").addEventListener("click", async () => {
    const minReviews = parseInt(document.getElementById("minReviews").value) || 0;
    const minRating = parseFloat(document.getElementById("minRating").value) || 0;
    const onlyNoWebsite = document.getElementById("onlyNoWebsite").checked;

    document.getElementById("scrapeBtn").style.display = "none";
    document.getElementById("stopBtn").style.display = "block";
    document.getElementById("downloadBtn").style.display = "none";
    document.getElementById("status").textContent = "Status: Starting...";
    
    chrome.storage.local.set({ 
        scrapeFilters: { minReviews, minRating, onlyNoWebsite },
        stopScraping: false 
    });

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to background to start the process
    try {
        chrome.runtime.sendMessage({ action: "start_scraping", tabId: tab.id }, (response) => {
            if (chrome.runtime.lastError) {
                // Ignore port closed error, background is working
            }
        });
    } catch (e) {}

    // Start polling for status updates
    pollStatus();
});

document.getElementById("stopBtn").addEventListener("click", () => {
    chrome.storage.local.set({ stopScraping: true });
    document.getElementById("status").textContent = "Status: Stopping...";
    document.getElementById("stopBtn").style.display = "none";
    document.getElementById("scrapeBtn").style.display = "block";
});

document.getElementById("downloadBtn").addEventListener("click", () => {
    try {
        chrome.runtime.sendMessage({ action: "download" }, (response) => {
            if (chrome.runtime.lastError) { /* Ignore */ }
        });
    } catch (e) {}
});

function pollStatus() {
    try {
        chrome.runtime.sendMessage({ action: "get_status" }, (response) => {
            if (chrome.runtime.lastError) {
                // If port closed (popup was closed and reopened), try again shortly
                pollInterval = setTimeout(pollStatus, 1000);
                return;
            }

            if (response) {
                document.getElementById("totalScanned").textContent = response.scanned;
                document.getElementById("totalQualified").textContent = response.qualified;
                document.getElementById("status").textContent = "Status: " + response.status;
                
                if (response.status === "running") {
                    pollInterval = setTimeout(pollStatus, 500);
                } else {
                    clearTimeout(pollInterval);
                    if (response.data && response.data.length > 0) {
                        document.getElementById("downloadBtn").style.display = "block";
                    }
                    document.getElementById("scrapeBtn").style.display = "block";
                    document.getElementById("stopBtn").style.display = "none";
                }
            }
        });
    } catch (e) {
        pollInterval = setTimeout(pollStatus, 1000);
    }
}

// Check status on popup open
window.addEventListener('load', pollStatus);