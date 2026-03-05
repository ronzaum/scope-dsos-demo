# FE-008: Dark / Light mode toggle

**Type:** Feature | **Priority:** Normal | **Effort:** Medium

## TL;DR
Add a Sun/Moon icon button to the top-right corner of every page that toggles between dark and light mode. Tailwind `darkMode: ["class"]` is already configured — needs a theme context, CSS variable overrides for dark mode, and a toggle button in the layout.

## Current State
- No theme toggle exists anywhere in the UI
- `tailwind.config.ts` already has `darkMode: ["class"]` — the infrastructure is ready
- `index.css` only defines light mode CSS variables; no `.dark` overrides exist
- No `ThemeContext` or `ThemeProvider` in the app

## Expected Outcome
- Sun/Moon icon button sits fixed in the top-right corner (visible on all pages)
- Clicking it toggles the `dark` class on `<html>`
- Preference persisted in `localStorage` so it survives page refresh
- All existing semantic colors (`background`, `foreground`, `border`, `muted`, etc.) respond correctly via CSS variable overrides in `index.css`

## Files
- `frontend/src/contexts/ThemeContext.tsx` — create: `ThemeProvider` + `useTheme` hook, reads/writes `localStorage`
- `frontend/src/components/Layout.tsx` — add a fixed top-right `<button>` rendering `Sun` or `Moon` from lucide-react
- `frontend/src/index.css` — add `.dark { ... }` block with dark mode CSS variable values for all tokens
- `frontend/src/main.tsx` — wrap `<App>` with `<ThemeProvider>`

## Notes
- Use `lucide-react` for icons (`Sun`, `Moon`) — already a project dependency
- The toggle should also be accessible from the sidebar bottom area as an alternative placement consideration
- Test that sidebar (`bg-sidebar`), cards, badges, and muted text all look correct in dark mode — these use custom tokens so they need explicit `.dark` overrides
