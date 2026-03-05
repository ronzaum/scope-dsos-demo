# FE-024: UI Cleanup — Add Scope Logo, Remove Lovable Boilerplate

**Type:** Improvement | **Priority:** Normal | **Effort:** Small
**Related:** None

## TL;DR

The frontend is missing the Scope logo (sidebar just shows "DS-OS" text), still has Lovable branding in meta tags, and carries dead Vite boilerplate files. Add the logo, clean the meta, delete the dead code.

## Current State

- **Sidebar header** shows "DS-OS" in monospace text with "Scope AI" subtitle. No logo image. Collapsed state shows "DS" text
- **index.html** meta description says "Lovable Generated Project", author says "Lovable", OG/Twitter images point to Lovable CDN, Twitter site is `@Lovable`, and TODO comments remain
- **App.css** is the default Vite scaffold CSS (`.logo`, `.card`, `.read-the-docs`, `logo-spin` keyframes) — nothing references it
- **Index.tsx** is the default Lovable placeholder ("Welcome to Your Blank App")

## Expected Outcome

### 1. Add Scope logo to sidebar
- Copy `logo_Scope AI.png` to `frontend/public/logo_scope.png`
- Expanded sidebar: logo image next to "DS-OS" text (+ "Scope AI" subtitle stays)
- Collapsed sidebar: logo image only, no "DS" text
- Logo is a white ring on dark background (PNG, dark bg baked in — acceptable)

### 2. Clean up index.html
- Title: "Scope Deployment OS" (proper casing)
- Remove Lovable meta description, author, OG image, Twitter tags
- Remove TODO comments

### 3. Delete App.css
- Unused Vite boilerplate — no imports reference it

### 4. Clean up Index.tsx
- If routed, redirect to Overview
- If orphaned, delete it

## Files

### Must change
- `frontend/src/components/AppSidebar.tsx` — add logo image, adjust collapsed/expanded states
- `frontend/index.html` — fix meta tags, remove Lovable references
- `frontend/public/logo_scope.png` — new file (copy from repo root)

### Must delete
- `frontend/src/App.css` — dead boilerplate

### May change
- `frontend/src/App.tsx` — check if Index.tsx is routed, remove if so
- `frontend/src/pages/Index.tsx` — delete if orphaned or redirect

### 5. Remove all em dashes (" — ")
- Find and remove every instance of " — " (space-em-dash-space) across the entire frontend
- Replace with " - " (space-hyphen-space) or restructure the text as appropriate
- This applies to all page titles, subtitles, headings, labels, badge text, and any hardcoded strings
- Also check fallback data files and API responses that feed into the UI

## Notes

- Logo PNG has dark background baked in — no transparent version available, user confirmed this is fine
- Sidebar collapsed width is ~56px — logo needs to fit at icon size (~32px)
- Font system (Inter + JetBrains Mono) is fine, no changes needed
- Em dashes (" — ") are not allowed anywhere in the UI going forward
