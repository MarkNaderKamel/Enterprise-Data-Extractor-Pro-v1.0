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
