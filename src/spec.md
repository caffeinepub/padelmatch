# Specification

## Summary
**Goal:** Fix blank chat and ensure matched users’ profiles load correctly after a match while preserving existing profile privacy rules.

**Planned changes:**
- Backend: Update `getUserProfile(user : Principal)` authorization to allow access when the caller is the same user or when the caller and target user are part of an existing match; otherwise keep the current unauthorized trap behavior.
- Frontend: Update Matches and Chat screens to show explicit loading states (e.g., skeleton/header placeholder) while profile/chat data is being fetched.
- Frontend: Add clear, visible error states for failures from `useGetUserProfile(recipientId)` and/or `useGetChat(recipientId)` that avoid blank screens and keep back navigation usable.

**User-visible outcome:** Opening a match reliably shows the other user’s profile header and chat area with loading placeholders while data loads; if something fails, the app shows an error message instead of a blank screen and the user can still navigate back (and messaging remains restricted to matched users only).
