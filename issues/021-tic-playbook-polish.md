# FE-021: TIC Playbook — Polish & Content Gaps

**Type:** Improvement | **Priority:** High | **Effort:** Medium
**Parent:** FE-020 (TIC Playbook UX Overhaul)

## TL;DR

Six refinements to the TIC Playbook page: fix card sizing consistency, improve text contrast, add missing examples across Inspection Cycle and Regulatory Standards, merge Inspection Types into Inspection Cycle (redundant sections), and remove the "show examples" toggle in Report Structure — just display examples inline.

## Current State

- Cards are different sizes depending on content — looks uneven
- White text on cards doesn't have enough contrast (not bright enough)
- Inspection Cycle: most steps have no examples — need at least one per step per inspection type
- Regulatory Standards: only API 510 has worked examples — all other standards are bare
- Inspection Types and Inspection Cycle sections repeat overlapping content (types, steps, fields)
- Report Structure: examples hidden behind a "Show Examples" toggle — adds friction

## Expected Outcome

### 1. Card Sizing
- All 7 section cards must be the same height and width regardless of content
- Use fixed dimensions or CSS grid with uniform row/column sizing
- Content that overflows gets truncated in the preview

### 2. Text Contrast
- Increase white text brightness/opacity on cards
- Ensure text passes WCAG AA contrast ratio against card backgrounds
- Check across all 7 blue-tinted cards

### 3. Inspection Cycle — Examples
- Every process step for every inspection type gets at least 1 domain-specific example
- Rendered in the ExampleBox component within step detail
- Cover all 6 inspection types across all cycle steps

### 4. Regulatory Standards — Examples
- Add worked examples (quantitative + qualitative) to all standards
- Currently only API 510 has examples — replicate that depth for API 570, ASME, PED, PSSR, LOLER, PUWER, ATEX

### 5. Merge Inspection Types into Inspection Cycle
- Remove Inspection Types as a standalone section
- Fold type-specific detail (fields, instruments, common defects, deployment notes) into the Inspection Cycle section
- Each inspection type's cycle flow becomes the primary view, with type metadata accessible within it
- Update section count from 7 to 6, adjust card grid accordingly

### 6. Report Structure — Inline Examples
- Remove the "Show Examples" toggle
- Display good/bad examples inline by default within each report section
- Keep the visual distinction between good and bad (green/red styling or similar)

## Files

### Must change
- `frontend/src/pages/Knowledge.tsx` — grid layout for uniform cards, section count update
- `frontend/src/components/knowledge/SectionCard.tsx` — fixed card dimensions, text contrast fix
- `frontend/src/components/knowledge/sections/InspectionCycleSection.tsx` — merge in type data, add examples
- `frontend/src/components/knowledge/sections/RegulatoryStandardsSection.tsx` — add examples for all standards
- `frontend/src/components/knowledge/sections/ReportStructureSection.tsx` — remove toggle, inline examples
- `api/parsers/knowledge.js` — merge inspection types into cycle data, add example content

### May change
- `frontend/src/components/knowledge/sections/InspectionTypesSection.tsx` — delete or repurpose
- `data/knowledge/inspection_types.md` — content reference (read-only, structure may inform merge)
- `frontend/src/data/fallbacks.ts` — update fallback data for merged structure

## Notes

- Merging inspection types into cycles reduces cognitive overhead — the split felt redundant
- Example content is the bulk of the effort (content authoring across 6 types x N steps + 7 standards)
- Card sizing fix is pure CSS — quick win
- Text contrast fix should be validated visually across all cards after applying
