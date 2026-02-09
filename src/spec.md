# Specification

## Summary
**Goal:** Reduce initial page load time and perceived latency by keeping the app responsive during startup and cutting unnecessary upfront work.

**Planned changes:**
- Replace the long full-screen blocking spinner with a fast-rendering app shell and lightweight inline loading/skeleton states; only block navigation when required to decide between Profile Setup vs Main App.
- Add route/screen code-splitting for non-initial screens (e.g., Matches, Profile, Settings, Chat, Match Profile) with small inline fallbacks while modules load.
- Tune React Query defaults and key queries to reduce unnecessary startup refetches (e.g., sensible staleTime/refetchOnWindowFocus/refetchOnMount, conservative retries/delays) while preserving correctness.
- Defer non-critical background work (e.g., notification/message polling initialization) until after the main UI is visible.
- Add developer-only startup performance instrumentation that logs timings (bootstrap → first meaningful render) in development builds.

**User-visible outcome:** The app shows a usable UI faster on startup with fewer blocking loaders, navigation remains correct (including profile setup routing), and subsequent screens load smoothly with lightweight inline loading while their code downloads.
