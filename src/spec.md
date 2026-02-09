# Specification

## Summary
**Goal:** Replace the free-text “Zona” filter in Discover with a dropdown of Uruguay departments to make zone filtering selectable and consistent.

**Planned changes:**
- Update `frontend/src/components/DiscoverFilters.tsx` so the “Zona” field uses the existing `Select/SelectItem` components instead of a text input.
- Populate the “Zona” dropdown with exactly these options: Artigas, Canelones, Cerro Largo, Colonia, Durazno, Flores, Florida, Lavalleja, Maldonado, Montevideo, Paysandú, Río Negro, Rivera, Rocha, Salto, San José, Soriano, Tacuarembó, Treinta y Tres.
- Add a clear “no zone filter” option (e.g., All/Any) that sets `filters.zone` to an empty string.
- Ensure selecting a department calls `onFiltersChange` to update `filters.zone` with the selected department string, while keeping the existing filters object shape passed from `DiscoverScreen` to `useDiscoverCandidates`.

**User-visible outcome:** In Discover filters, users can choose a Uruguay department from a “Zona” dropdown (or select All/Any) instead of typing the zone manually.
