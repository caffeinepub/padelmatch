# Specification

## Summary
**Goal:** Make the Zone (Uruguay departments) dropdown vertically scrollable so all 19 departments (plus the “All” option) are accessible on typical mobile screens.

**Planned changes:**
- Update the Zone select dropdown in `frontend/src/components/DiscoverFilters.tsx` to constrain the options list height and enable vertical scrolling when it exceeds available space.
- Ensure scroll interaction works via mouse wheel/trackpad on desktop and touch scrolling on mobile without impacting the layout of the Minimum/Maximum Category selects in the same sheet.

**User-visible outcome:** Users can open the Zone dropdown and scroll through the list to view and select any Uruguay department (and the “All” option) on both mobile and desktop.
