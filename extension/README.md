# Tracely Browser Extension

This directory contains the Chrome extension code for Tracely.

## Structure

- `manifest.json` - Extension manifest (Manifest V3)
- `src/popup/` - Extension popup UI
- `src/background/` - Service worker (background processes)
- `src/content/` - Content script (runs on every page)

## Development

### Build
```bash
npm run build
```

### Load in Chrome
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `/extension` folder

### How it works

1. **Content Script** (`src/content/content.js`) runs on every page and detects:
   - Third-party scripts
   - Tracking pixels
   - Storage access
   - Known trackers

2. **Service Worker** (`src/background/service-worker.js`) receives reports and:
   - Aggregates tracking data
   - Sends data to backend API
   - Manages storage

3. **Popup** (`src/popup/popup.html`) displays:
   - Privacy risk score
   - Tracker count
   - Quick insights

## Permissions

- `storage` - Store tracking data locally
- `tabs` - Access tab information
- `scripting` - Inject detection code
- `<all_urls>` - Monitor all websites

## Data Flow

```
Page Loaded
   ↓
Content Script detects trackers
   ↓
Reports to Service Worker
   ↓
Service Worker stores locally + sends to backend
   ↓
Popup displays aggregated data
```
