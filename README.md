# Pro Lead Extractor (v1.0)

A powerful Chrome Extension built on Manifest V3 designed to extract business leads and emails from Google Maps, Google Search, and LinkedIn Company pages.

This is the foundational version of the extension, utilizing direct DOM scraping and background service workers to queue and deep-scan websites for emails.

## ✨ Features (v1.0)
- **Multi-Source Scraping:** Extracts data from Google Maps, Google Search results, and LinkedIn Company pages.
- **Deep Email Scanner:** Automatically detects business websites, fetches their HTML via a CORS proxy, and extracts emails using advanced Regex.
- **DOM Email Extraction:** Captures emails that are visibly displayed on the search page before even deep-scanning the website.
- **Local Database:** Saves all leads locally using chrome.storage.local.
- **CSV Export:** One-click export of all scraped leads to a standard CSV format.

## 🛠️ Installation
1. Download or clone this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable Developer mode (toggle in the top right corner).
4. Click `Load unpacked` and select the `v1-basic` folder.
5. The extension icon will appear in your browser toolbar.

## 🚀 Usage
1. Go to Google Maps, Google Search, or a LinkedIn Company page.
2. Search for a business, keyword, or industry.
3. Click the extension icon and select the relevant "Extract" button.
4. Wait for the scraping to finish, then click "Export Leads to CSV".

## ⚠️ Disclaimer
Scraping Google, LinkedIn, and other platforms may violate their Terms of Service. This tool is intended for educational purposes and personal lead generation. Use it responsibly and ensure compliance with local data privacy laws (GDPR/CCPA). The developers are not responsible for any misuse of this extension.
-----------------------------------------------------------------------------------------------------

# Enterprise Data Extractor Pro (v2.0)

An enterprise-grade, fully autonomous Chrome Extension (Manifest V3) built for massive lead generation and data extraction.

## Overview
Version 2.0 completely overhauls the architecture to bypass Chrome's hidden tab throttling, prevent Service Worker death, and handle infinite-scrolling pages. It autonomously operates in the background, allowing you to close the tab and continue browsing while it works.

## 🚀 What's New in v2.0? (Enterprise Upgrade)
- **Autonomous Background Tabs:** No need to keep the scraped tab open. The extension opens a hidden background tab, scrapes it, and closes it automatically.
- **Smart MutationObserver Scrolling:** Bypasses Chrome's background tab throttling to fully scroll infinite-loading pages (Google Maps, YouTube, LinkedIn Jobs).
- **Auto-Pagination:** Automatically clicks the "Next" button on Google Search, scraping page after page until the end.
- **IndexedDB Integration:** Replaced chrome.storage with IndexedDB to support storing 100,000+ leads without crashing.
- **Service Worker Keep-Alive:** Uses chrome.alarms to prevent Chrome from killing the background scanner during long tasks.
- **Multi-Proxy Fallback:** If one CORS proxy goes down, the script instantly falls back to 3 others, ensuring 100% uptime for email deep-scanning.
- **Arabic / UTF-8 Support:** Ensures Arabic text is properly scraped and exports CSVs with a UTF-8 BOM so they open perfectly in Excel without corruption.

## 🎯 Supported Scrapers
- **Google Maps:** Auto-scrolls the entire sidebar. Extracts Name, Rating, Address, Category, Phone, Website, and Emails.
- **Google Search:** Auto-paginates. Extracts Title, URL, Snippet, and Emails.
- **LinkedIn Jobs:** Auto-scrolls job lists. Extracts Job Title, Company, Location, and Apply Link.
- **YouTube Channel Videos:** Auto-scrolls channel video tabs. Extracts Video Title, URL, Views, and Date Posted.

## 🕵️ Deep Scan Engine
When a website URL is found,
the background engine:
1. Fetches the root HTML using a rotating list of CORS proxies.
2. Forces UTF-8 decoding to support Arabic/International websites.
3. Extracts standard emails, mailto: links,
and obfuscated emails (name [at] domain [dot] com).
4. Uses pure Regex to locate /contact or /about pages and deep-scans them too.

## 🛠️ Installation
1. Download or clone this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable Developer mode (toggle in the top right corner).
4. Click Load unpacked and select the `v2-enterprise` folder.
5. Pin the extension to your toolbar.

## 💻 Usage Guide
1. Start Scraping: Go to Google Maps,
   Google Search,
a LinkedIn Jobs page,
or a YouTube Channel's Videos tab.
2. Click the extension and hit the corresponding "Scrape" button.
3. Watch the Console: A live progress bar and console log will appear in the popup,
showing you exactly what the background tab is doing.
4. Continue Browsing: You can close the popup and browse other websites.
the extension will keep working in the background.
5. Deep Scan Progress: The progress bar will switch to "Deep Scanning" 
and show you how many websites are being scanned for emails.
6. Export Data: Click "Export All Data to CSV".
7. Clear Data: Click "Clear All Database" 
to wipe IndexedDB before your next massive scrape.

## 🏗️ Architecture Overview
- Manifest V3: Modern Chrome extension standard.
- Service Worker (`background.js`): Manages tab creation,
db transactions,multi-proxy fetching,and deep-scan queue..	-	Content Script (`content.js`): Injects into hidden tabs
to handle SmartScrolling,D DOM parsing,and pagination..	-	IndexedDB: Unlimited local storage for heavy enterprise data sets..	-	
## ⚠️ Legal & Ethical Disclaimer
Scraping Google Maps,LikedIn,and YouTube may violate their Terms of Service.This tool is intended for educational purposes,
glead generation,and data analysis.If deploying commercially,you must:
default implementation:
demonstrate compliance with data privacy laws(GDPR,CAPPA),and respect robots.txt/rate limits.The developers assume no liability for misuse of this software.
