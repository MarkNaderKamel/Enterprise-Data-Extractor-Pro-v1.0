(async function() {
    const { scrapeFilters, stopScraping } = await chrome.storage.local.get(['scrapeFilters', 'stopScraping']);
    const { minReviews, minRating, onlyNoWebsite } = scrapeFilters;

    const scrollable = document.querySelector('div[role="feed"]') || document.querySelector('div[aria-label*="Results" i]');
    if (!scrollable) {
        chrome.runtime.sendMessage({ action: "scraping_error", message: "No results found." });
        return;
    }

    let lastHeight = 0;
    let noChangeCount = 0;
    const maxNoChange = 5;
    let totalScanned = 0;

    async function waitForNewResults(prevCount) {
        let attempts = 0;
        while (attempts < 20) { // Wait max 5 seconds (20 * 250ms)
            await new Promise(r => setTimeout(r, 250));
            let currentCount = document.querySelectorAll('div[role="article"] a[href*="/maps/place/"]').length;
            if (currentCount > prevCount) return true; // New results loaded
            
            const endText = Array.from(scrollable.querySelectorAll('span, div')).some(s => 
                (s.textContent && s.textContent.includes("You've reached the end of the list")) || 
                (s.textContent && s.textContent.includes("تم الوصول إلى نهاية القائمة"))
            );
            if (endText) return false; // Reached end
            
            let shouldStop = await new Promise(res => chrome.storage.local.get('stopScraping', d => res(d.stopScraping)));
            if (shouldStop) return false; // User stopped

            attempts++;
        }
        return false; // Timeout
    }

    while (noChangeCount < maxNoChange) {
        let shouldStop = await new Promise(res => chrome.storage.local.get('stopScraping', d => res(d.stopScraping)));
        if (shouldStop) break;

        scrollable.scrollBy(0, 1500);
        
        const prevCount = document.querySelectorAll('div[role="article"] a[href*="/maps/place/"]').length;
        const newResultsLoaded = await waitForNewResults(prevCount);

        if (!newResultsLoaded) {
            noChangeCount++;
        } else {
            noChangeCount = 0;
        }

        totalScanned = document.querySelectorAll('div[role="article"]').length;
        let qualified = 0;
        document.querySelectorAll('div[role="article"]').forEach(card => {
            const websiteBtn = card.querySelector('a[data-value="Website"], a[aria-label*="Website" i]');
            if (!(onlyNoWebsite && websiteBtn)) qualified++;
        });

        chrome.runtime.sendMessage({ action: "update_progress", scanned: totalScanned, qualified: qualified });
    }

    await new Promise(r => setTimeout(r, 1500));

    const results = [];
    const businessCards = document.querySelectorAll('div[role="article"]');
    const seenLinks = new Set();

    businessCards.forEach(card => {
        try {
            const link = card.querySelector('a[href*="/maps/place/"]');
            if (!link) return;

            const mapsUrl = link.href;
            if (seenLinks.has(mapsUrl)) return;
            seenLinks.add(mapsUrl);

            const name = link.getAttribute('aria-label') || 'N/A';

            const websiteBtn = card.querySelector('a[data-value="Website"], a[aria-label*="Website" i]');
            const hasWebsite = !!websiteBtn;
            const website = hasWebsite ? websiteBtn.href : '';
            let domain = 'N/A';
            if (hasWebsite && website) {
                try { domain = new URL(website).hostname.replace('www.', ''); } catch(e) {}
            }

            if (onlyNoWebsite && hasWebsite) return;

            const ratingEl = card.querySelector('span[role="img"][aria-label*="stars" i], span[role="img"][aria-label*="نجمة"]');
            const ratingMatch = ratingEl ? ratingEl.getAttribute('aria-label').match(/(\d\.\d)/) : null;
            const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

            const reviewsEl = card.querySelector('span[role="img"]')?.parentElement.querySelector('span');
            const reviewsText = reviewsEl ? reviewsEl.textContent.replace(/[(),\s]/g, '') : '0';
            const reviews = parseInt(reviewsText) || 0;

            if (reviews < minReviews || rating < minRating) return;

            const phoneBtn = card.querySelector('button[aria-label*="Phone" i], a[href^="tel:"]');
            let phone = 'N/A';
            if (phoneBtn) {
                const phoneText = phoneBtn.getAttribute('aria-label') || phoneBtn.getAttribute('href') || '';
                const phoneMatch = phoneText.match(/(\+?\d[\d\s\-()]{7,})/);
                if (phoneMatch) phone = phoneMatch[1].trim();
            }

            const infoDiv = card.querySelector('div[class*="fontBodyMedium"]');
            let category = 'N/A';
            let address = 'N/A';
            if (infoDiv) {
                const spans = infoDiv.querySelectorAll('span');
                if (spans.length > 0) category = spans[0].textContent.trim();
                const addressNode = infoDiv.querySelector('div[jslog]') || infoDiv.children[infoDiv.children.length - 1];
                if (addressNode) address = addressNode.textContent.split('·').pop().trim();
            }

            let status = 'N/A';
            const statusSpan = Array.from(card.querySelectorAll('span')).find(s => 
                /open|closed|مفتوح|مغلق/i.test(s.textContent) && s.textContent.length < 20
            );
            if (statusSpan) status = statusSpan.textContent.trim();

            let lat = 'N/A', lng = 'N/A';
            const coordMatch = mapsUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
            if (coordMatch) {
                lat = coordMatch[1];
                lng = coordMatch[2];
            } else {
                const atMatch = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (atMatch) { lat = atMatch[1]; lng = atMatch[2]; }
            }

            results.push({ name, category, rating, reviews, address, phone, hasWebsite, website, domain, status, lat, lng, mapsUrl });

        } catch (e) {}
    });

    chrome.runtime.sendMessage({ action: "scraping_done", data: results });
})();