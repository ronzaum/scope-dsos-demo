# FE-007: Remove terminal page

**Type:** Improvement | **Priority:** Normal | **Effort:** Low

## TL;DR
The terminal page is a canned animation loop that doesn't serve the frontend's purpose. It shows hardcoded DS-OS command sequences typing out with fake output — looks polished but does nothing. Remove it entirely.

## Current State
- `/terminal` route renders a split-screen with animated command typing (left) and affected files panel (right)
- Two hardcoded scenarios loop infinitely (Intertek new client flow, TÜV SÜD problem flow)
- No real functionality — all output is pre-defined, no API calls, no user interaction
- Confusing for users who expect it to do something

## Expected Outcome
- Terminal page and route removed
- Sidebar navigation entry removed
- No dead code left behind (terminal-specific CSS variables, blink animation if unused elsewhere)

## Files
- [Terminal.tsx](frontend/src/pages/Terminal.tsx) — delete entire file
- [App.tsx](frontend/src/App.tsx) — remove `/terminal` route
- [AppSidebar.tsx](frontend/src/components/AppSidebar.tsx) — remove terminal nav item
- [tailwind.config.ts](frontend/tailwind.config.ts) — remove `blink` animation if only used by terminal
- [index.css](frontend/src/index.css) — remove `--terminal-bg`, `--terminal-green`, `--terminal-text` CSS variables (lines ~54-56)

## Notes
- Issue FE-001 (fix terminal pause) becomes obsolete — close it when this ships
- If we later want system activity visibility, that's a separate feature with a real purpose
