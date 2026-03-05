# FE-006: Status badge text wraps to next line in tables

**Type:** Bug | **Priority:** High | **Effort:** Low

## TL;DR
Coloured status badges in all tables break onto two lines when the cell is narrow. The badge box should always stay on one line.

## Current State
- Badge text wraps inside the coloured box, splitting across two lines
- Affects every table with status/severity/stage badges (client list, issues, risk register, constraint map, deployment plan, overview)
- Root cause: badge CSS classes in `index.css` and inline badge spans don't include `whitespace-nowrap`

## Expected Outcome
- Badge text stays on a single line — no wrapping inside the coloured box
- Badge shrinks or the cell expands, but the text never breaks

## Files
- [index.css](frontend/src/index.css) — badge class definitions (lines 94–169), add `whitespace-nowrap` to all `.badge-*` and `.confidence-*` classes
- Optionally: any component using inline badge spans without the shared CSS classes (e.g. [ClientQuickView.tsx](frontend/src/components/ClientQuickView.tsx))

## Notes
- Low effort fix — one Tailwind utility added to each badge class, or a single shared base class
- Consider also adding `shrink-0` on badge spans inside flex containers to prevent compression
