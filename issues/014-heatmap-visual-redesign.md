# FE-014: Pattern Grid Heatmap — Visual Redesign

**Type:** Improvement | **Priority:** High | **Effort:** Small

## TL;DR
The PatternGrid currently renders as a table with tiny dots — reads like a spreadsheet, not a heatmap. Redesign the grid cells as small filled squares with visible gaps between them (mosaic style), a red/blue intensity gradient, and a cursor-following hover tooltip instead of click popovers.

## Current State
- HTML `<table>` with 12px round dots in padded cells with borders
- Looks like a data table, not a visual heatmap
- Click-to-open popover for field details (slow interaction)
- Distinct color categories (red/orange/blue/grey) — no gradient feel

## Expected Outcome
- **Small filled squares** (~24-28px) with 3-4px gaps between them — background shows through
- **Red/blue gradient** color scale for match intensity (dark red = identical → light → grey → blue = unique)
- **Cursor-following tooltip** on hover replaces click popover — lightweight, shows matched fields as you mouse across
- Section labels on Y-axis, template labels on X-axis
- Dense mosaic feel — glance at it and immediately see hot zones vs cold zones
- Preserve existing functionality: template filter, DS row selection/checkboxes, core block row indicators, family grouping

## Files
- `frontend/src/components/PatternGrid.tsx` — sole file to change

## Notes
- No API changes needed — same grid data shape
- Keep all existing props/interface (`PatternGridProps`) intact
- The `CellDot` sub-component gets replaced entirely
- Table layout likely replaced with CSS grid for precise gap control
