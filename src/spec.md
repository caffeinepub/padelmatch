# Specification

## Summary
**Goal:** Update the Discover Filters sheet UI to replace the single “Filtrar por” selector with separate Minimum category, Maximum category, and Zone controls (including all Uruguay departments), with selections persisting while the sheet is opened/closed.

**Planned changes:**
- Replace the existing “Filtrar por” dropdown area in the Discover filters sheet with three inputs: Minimum category (1st–7th), Maximum category (1st–7th), and Zone (default “All departments” plus all Uruguay departments).
- Add a reusable, explicit frontend list of Uruguay’s 19 departments and use it to populate the Zone dropdown options.
- Store Minimum category, Maximum category, and Zone selections in Discover screen state and pass them into the DiscoverFilters component so values persist across sheet open/close and can be adjusted independently.

**User-visible outcome:** When opening Filters on Discover, the user can choose a minimum category, maximum category, and a zone (all Uruguay departments), and their selections remain set when closing and reopening the filters sheet.
