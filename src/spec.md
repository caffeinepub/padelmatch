# Specification

## Summary
**Goal:** Replace the current 1–5 star “Nivel” system with a 7-value “Category” (1era–7ma) across profile setup, edit, display, and storage.

**Planned changes:**
- Update Profile Setup form: replace “Nivel (1-5)” star/level selector with “Category (1era–7ma)” selector containing exactly: 1era, 2da, 3era, 4ta, 5ta, 6ta, 7ma; submit selected value with profile creation.
- Update Edit Profile form: use the same “Category (1era–7ma)” selector; preselect the saved value; persist updates.
- Update profile displays (discover cards and profile screen): remove star rendering and show the selected category label (e.g., “3era” / “Category: 3era”); remove any “Nivel (1-5)” wording.
- Update backend profile model and endpoints: replace the 5-value level with a 7-value category enum (1era–7ma) in create/update and storage; update any ordering/comparison helper to handle all 7 values correctly.
- Update frontend type bindings/usages: ensure end-to-end create/update flows use the new 7-value enum and remove/adjust any 1–5 assumptions so the app compiles cleanly.

**User-visible outcome:** Users can select a padel “Category” from 1era to 7ma during profile setup and editing, and the app displays that category label (not stars) on profile cards and the profile screen.
