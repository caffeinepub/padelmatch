# Specification

## Summary
**Goal:** Fix the Discover screen crash/white screen when tapping the “FILTROS” button so the filters sheet opens reliably and renders its controls.

**Planned changes:**
- Fix the Discover filters sheet runtime crash so opening “FILTROS” does not blank the app and no uncaught exceptions occur.
- Update the filters UI to use stable string values for Shadcn Select `value` / `SelectItem value` props while still mapping selections to a valid `Filters` object for `useDiscoverCandidates(filters)`.
- Add a minimal safe failure mode for the filters panel: if the filters UI throws during render, show an inline error state inside the sheet with a way to close it (without breaking the rest of Discover).

**User-visible outcome:** Tapping “FILTROS” opens a working filters sheet (minimum level, maximum level, zone) without crashing; selections display correctly and refresh results, and any unexpected filters UI error is contained to the sheet with a recoverable inline message.
