# Specification

## Summary
**Goal:** Restore the PlayPal logo to the previous gradient “PlayPal” wordmark with a single underline, and ensure it appears consistently across app icons and the Login screen without changing the app name.

**Planned changes:**
- Replace the existing PlayPal logo assets in `frontend/public/assets/generated/` with updated versions that match the gradient wordmark + underline style.
- Ensure the Login screen (`frontend/src/screens/LoginScreen.tsx`) continues to reference and display `/assets/generated/playpal-logo.dim_512x512.png`, now showing the restored logo style.
- Keep existing PWA/Apple touch icon references (`frontend/public/manifest.json`, `frontend/index.html`) pointing to the same filenames while updating the underlying image files.
- Keep the service worker precache list (`frontend/public/service-worker.js`) referencing the same PlayPal logo filenames, with the cached files now being the updated logo.

**User-visible outcome:** Users will see the restored PlayPal gradient wordmark with an underline on the Login screen and as the app icon (PWA and Apple touch icon), with the app name still “PlayPal”.
