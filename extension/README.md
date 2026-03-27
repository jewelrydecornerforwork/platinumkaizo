# Web Form Research PoC

This directory contains a standalone Chrome Extension Manifest V3 proof of concept for:

- scanning the current page for `form` elements that contain both email and URL fields
- exporting matched form metadata to JSON
- autofilling matched forms only on explicit test allowlist hosts

## Files

- `manifest.json`: MV3 extension manifest
- `content-script.js`: DOM parsing and whitelist autofill logic
- `popup.html`: popup shell
- `popup.css`: popup styles
- `popup.js`: popup actions for scan, export, and autofill

## Load in Chrome

1. Open `chrome://extensions`
2. Enable Developer mode
3. Choose Load unpacked
4. Select this `extension` directory

## Test allowlist

The allowlist is defined in `content-script.js` as `TEST_SITE_ALLOWLIST`.

Default entries:

- `localhost`
- `127.0.0.1`
- `.localtest.me`
- `example.test`

Update this list to your own controlled test hosts before running autofill.

## Notes

- The content script only reports form metadata and does not submit forms.
- Autofill is a manual action from the popup and is blocked on non-allowlisted hosts.
- The extension is intentionally build-free so you can inspect and modify the DOM logic directly.
