let scrapingState = {
    status: 'idle',
    scanned: 0,
    qualified: 0,
    data: []
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start_scraping") {
        scrapingState = { status: 'running', scanned: 0, qualified: 0, data: [] };
        
        chrome.scripting.executeScript({
            target: { tabId: request.tabId },
            files: ["content.js"]
        }).catch(err => {
            scrapingState.status = 'error';
            scrapingState.data = [];
        });
        
        // Send response synchronously
        sendResponse({ started: true });
        
    } else if (request.action === "update_progress") {
        scrapingState.scanned = request.scanned;
        scrapingState.qualified = request.qualified;
        // Send response synchronously to close port cleanly
        sendResponse({ received: true });
        
    } else if (request.action === "scraping_done") {
        scrapingState.status = 'done';
        scrapingState.data = request.data;
        sendResponse({ received: true });
        
    } else if (request.action === "scraping_error") {
        scrapingState.status = 'error: ' + request.message;
        sendResponse({ received: true });
        
    } else if (request.action === "get_status") {
        sendResponse(scrapingState);
        
    } else if (request.action === "download") {
        if (scrapingState.data.length > 0) {
            let csv = "Name,Category,Rating,Reviews,Address,Phone,Website,Domain,Has Website,Status,Latitude,Longitude,Maps URL\n";
            scrapingState.data.forEach(row => {
                const safe = (val) => `"${val ? String(val).replace(/"/g, '""') : ''}"`;
                csv += `${safe(row.name)},${safe(row.category)},${row.rating || ''},${row.reviews || ''},${safe(row.address)},${safe(row.phone)},${safe(row.website)},${safe(row.domain)},${row.hasWebsite ? 'Yes' : 'No'},${safe(row.status)},${safe(row.lat)},${safe(row.lng)},${safe(row.mapsUrl)}\n`;
            });
            
            const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            chrome.downloads.download({
                url: dataUrl,
                filename: "Maps_Pro_Max_Leads.csv",
                saveAs: true
            });
        }
        sendResponse({ downloaded: true });
    }
    
    // Removed "return true" to prevent Chrome from keeping the port open asynchronously
});