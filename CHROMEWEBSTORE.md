# Chrome Web Store Listing — Mock Data Extension

> Last Updated: 2026-10-12

## Store Listing

**Extension Name** [REQUIRED]

Mock Data Extension

<!-- Matches manifest.json "name". A more specific name (e.g. "Mock Data — API Response Mocker")
     would rank better in search; if changed, update manifest.json too. -->

**Short Description** [REQUIRED]

Return your own JSON for chosen API endpoints and HTTP methods on any website. Test frontends without changing the backend.

<!-- 123/132 characters. Same text as manifest.json "description" — keep them in sync. -->

**Detailed Description** [REQUIRED]

```
Mock Data Extension replaces real API responses with JSON you define, right in your browser.

Use it to build and test a frontend before the backend is ready, reproduce edge cases (empty lists, unusual values, large payloads), or demo an app without a live server.

Features:
• Mock any endpoint by HTTP method (GET, POST, PUT, DELETE) and URL path
• Works on any website and any domain, including localhost
• Exact path matching: /api/users is mocked, /api/users/1 is not
• Use * to mock a whole group of paths, e.g. /api/users/*
• Query strings are ignored, so /api/users?page=2 gets the same mock
• See all your mocks in a list: edit, delete or turn off any of them without losing it
• Turn all mocks on or off with one switch
• Export your mocks to a JSON file and import them on another computer or share with your team
• Ready-made sample mocks so you can try it right away

How to use:
1. Click the extension icon to open the popup.
2. Choose the HTTP method, enter the endpoint path (for example /api/users) and paste the JSON response.
3. Click "Set Item" to save the mock.
4. Turn on "Enable API Mocking".
5. Reload the page: matching requests now return your JSON.

Privacy:
Everything stays on your device. The extension does not collect, read or send your browsing data, page content or requests. Your mocks are stored locally in your browser and are only used to answer requests that match the paths you entered. No analytics, no accounts, no servers.

Support:
Questions, bugs and feature requests: https://github.com/maratismodest/mocker-chrome-extension/issues
```

<!-- CWS strips markdown, so the description uses plain text and "•" bullets. -->

**Category** [REQUIRED]

Developer Tools

**Single Purpose** [REQUIRED]

Returns user-defined JSON responses for the API endpoints the user chooses, so developers can test web apps against mock data.

**Primary Language** [REQUIRED]

English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `public/icons/icon-128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ✅ Ready | `store-assets/screenshot-1.png` |
| Screenshot 2 [RECOMMENDED] | 1280×800 or 640×400 | ✅ Ready | `store-assets/screenshot-2.png` |
| Screenshot 3 [RECOMMENDED] | 1280×800 or 640×400 | ✅ Ready | `store-assets/screenshot-3.png` |
| Screenshot 4 | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 5 | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile [RECOMMENDED] | 440×280 | ⬜ Not created | |
| Marquee Promo Tile | 1400×560 | ⬜ Not created | |

<!-- Status options: ⬜ Not created | 🟡 Needs update | ✅ Ready -->

### Screenshot Notes

Screenshots 1–3 are rendered from the real popup build by `store-assets/generate.sh`
(sources in `store-assets/src/`). Re-run it after UI changes. The demo page in screenshot 2
is an illustration of a mocked response.

1. **Popup with a mock being created** — method GET, endpoint `/api/users`, a JSON response in the
   textarea, mocking switched on, the endpoint list below. Caption: "Define a mock in seconds".
2. **Mock in action** — a web page with DevTools → Network/Console open, showing a request to
   `/api/users` returning the mocked JSON. Caption: "Your JSON, returned on any site".
3. **Exact vs wildcard matching** — popup listing `/api/users` and `/api/users/*`, with a short
   annotation of which URLs each one matches. Caption: "Mock exactly the paths you need".
4. **Export / Import** — popup with the Export and Import buttons highlighted and a saved
   `mock-data-extension.json` file. Caption: "Share mocks with your team".
5. **On/off switch** — the same page with mocking off, showing the real response. Caption:
   "Switch between mock and real data instantly".

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `declarativeNetRequest` | permissions | The extension's only feature is answering API requests with JSON the user typed in. Chrome's request rules are used to redirect requests that match a user-defined method and URL path to that JSON. Rules are created only from mocks the user saved and are removed when the user deletes a mock, clears all mocks or turns mocking off. The extension never reads or records request or page contents. |
| `storage` | permissions | Saves the user's mock endpoints (method, path, JSON response) and the on/off setting locally, so mocks persist between browser sessions and the popup shows the saved list. Nothing is synced or sent off the device. |
| `<all_urls>` | host_permissions | Developers test against many different hosts — localhost on any port, staging and production domains — and the user decides which API paths to mock. Chrome requires host access to the request's site in order to redirect it to the mock response, and the target sites cannot be known in advance. The extension does not inject scripts, read pages or observe traffic; host access is used solely to apply the user's own mock rules. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

All data (the user's own mock endpoints, the on/off switch and the popup form draft) is
created by the user and stored only locally in the browser. Nothing is transmitted off the
device, and the extension does not read browsing history, page content or network traffic.

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | — | No |
| Health info | No | No | — | No |
| Financial info | No | No | — | No |
| Authentication info | No | No | — | No |
| Personal communications | No | No | — | No |
| Location | No | No | — | No |
| Web history | No | No | — | No |
| User activity | No | No | — | No |
| Website content | No | No | — | No |

### Data Use Certification

- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL** [REQUIRED]

https://github.com/maratismodest/mocker-chrome-extension/blob/main/PRIVACY.md

<!-- Source: PRIVACY.md in the repo root. The repo must stay public and the file must be on
     main before submission, or the link will 404 and the submission is auto-rejected. -->

## Distribution

**Store URL**: https://chromewebstore.google.com/detail/mock-data-extension/fdlfbgjbacfoflclbncmildgjhngcjmb
**Extension ID**: fdlfbgjbacfoflclbncmildgjhngcjmb

**Visibility**: Public
**Regions**: All regions

## Developer Info

**Publisher Name** [REQUIRED]

TODO

**Contact Email** [REQUIRED]

TODO <!-- Shown publicly on the store listing. -->

**Support URL / Email** [RECOMMENDED]

https://github.com/maratismodest/mocker-chrome-extension/issues

**Homepage URL** [RECOMMENDED]

https://github.com/maratismodest/mocker-chrome-extension

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.8 | 2026-10-12 | Mock list in the popup: per-mock on/off, edit and delete (replaces Get Item / Remove Item). New screenshots. Permissions unchanged. | Draft |
| 1.0.7 | 2026-10-12 | Update (permissions unchanged). Exact path matching with `*` wildcards; deleted, cleared or disabled mocks reliably stop applying; in-popup success/error messages; single-step import; fixed export of data containing `&`, `<`, `>`. | Draft |

<!-- Status options: Draft | Submitted | In Review | Published | Rejected -->

## Review Notes

### Pre-submission checklist

- [ ] Fill in Publisher Name and Contact Email above
- [x] Create at least 1 screenshot (1280×800 or 640×400) — `store-assets/screenshot-1..3.png`
- [ ] Push `PRIVACY.md` to `main` and check the Privacy Policy URL opens
- [ ] Build with `npm run build` and zip the **contents** of `dist/` (manifest.json at the zip root);
      the zip must not contain `.git/`, `node_modules/`, `.env` or this file

### Known Issues / Limitations

- **`<all_urls>` host permission** is the most likely reason for extra review time or a request
  for clarification. The justification above explains why it is needed. If the review asks to
  narrow it, the alternative is `optional_host_permissions` with access requested per domain
  when the user adds a mock.
- Only requests made with `fetch` / `XMLHttpRequest` are mocked; page navigations, scripts and
  images are not affected.
- Mocked responses always return status 200 with the JSON body; custom status codes, headers
  and delays are not supported.
- The production build is not minified (`build.minify: false`). This is allowed (code is readable,
  not obfuscated) and can make review easier.

### Rejection History

| Date | Reason | Fix Applied | Resubmitted |
|------|--------|-------------|-------------|
