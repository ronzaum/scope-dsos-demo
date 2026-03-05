# UI-011: Template Section Confidence Indicators — Tooltips, Warning Panel, Edit Requests

**Type:** Improvement | **Priority:** Normal | **Effort:** Medium

## TL;DR
Template library expanded view shows section chips but no visual confidence indicators. The confidence legend (🟢 Regulatory, 🟡 Industry Standard, 🟠 Inferred) already exists in template specs but isn't surfaced in the UI. Need: colored dots per section, hover tooltips with author-written reasons, a pre-send warning panel for flagged sections, and a "Request Edit" flow that creates a Linear task with push notification.

## Current State
- Template detail accordion renders sections as plain text chips — no colored dots, no confidence info
- Confidence tags exist in section headings (e.g., `## Section 3: Methodology 🟡 Industry Standard`) but are treated as literal text
- Parser (`api/parsers/template.js`) extracts headings as flat strings — no structured confidence data
- API returns `sections: ["Section 1: Report Header 🟢 Regulatory", ...]` — unparsed
- Frontend renders them as-is in monospace badges
- No mechanism to request edits, flag sections, or review before generating

## Expected Outcome

### 1. Spec format change — per-section reason
- Section headings in template specs get a `| reason` suffix:
  ```
  ## Section 3: Methodology 🟡 Industry Standard | Common TIC practice — verify client uses same NDT sequence
  ```
- Parser extracts each section into a structured object:
  ```json
  { "name": "Section 3: Methodology", "confidence": "🟡", "confidenceLabel": "Industry Standard", "reason": "Common TIC practice — verify client uses same NDT sequence" }
  ```

### 2. Colored dot per section chip
- Every section chip gets a small colored dot matching its confidence tag
- 🟢 = `text-emerald-600` | 🟡 = `text-amber-600` | 🟠 = `text-orange-600`
- All sections get dots (green, yellow, and orange) — not just flagged ones

### 3. Hover tooltip on section chip
- Hovering over a section chip shows a tooltip with:
  - **Confidence level** (e.g., "🟡 Industry Standard")
  - **Reason** — the author-written text from after `|` in the spec
  - **Adjustment risk** (e.g., "Low — may vary in format but substance is consistent")
- Content pulled dynamically from parsed spec data, not hardcoded
- 2-3 lines max, technical tone
- Uses existing shadcn `Tooltip` component (already wrapped at app root)

### 4. Pre-send warning panel (soft gate)
- Clicking "Generate Report" when 🟠 Inferred sections exist shows a warning panel
- Panel lists all 🟠 sections with their reasons
- User can acknowledge and proceed with generation — not a hard block
- Uses existing shadcn `AlertDialog` component

### 5. "Request Edit" → Linear task + push notification
- "Request Edit" button available on flagged sections (🟠 Inferred)
- Creates a Linear issue assigned to the user with:
  - Section name and confidence level
  - The reason text describing what needs attention
  - Link back to the template
- Linear mobile/desktop app delivers push notification automatically on assignment
- Task surfaces in Overview daily progress box

## Files
- `data/templates/example_pressure_vessel_api510.md` — add `| reason` to section headings (reference spec)
- `api/parsers/template.js` — parse section headings into structured `{ name, confidence, confidenceLabel, reason }` objects
- `api/server.js` — API passes through new structured section data (minimal change)
- `frontend/src/pages/Templates.tsx` — section chips with colored dots, tooltip, warning panel, request edit button
- `frontend/src/components/ui/tooltip.tsx` — existing, no changes needed
- `frontend/src/components/ui/alert-dialog.tsx` — existing, no changes needed

## Notes
- Confidence data already flows through the pipeline as literal text — this is about parsing it into structured data and surfacing it properly
- No new dependencies required — shadcn Tooltip and AlertDialog already exist
- Linear integration for edit requests uses existing MCP tools (`mcp__linear__save_issue`)
- Push notifications are handled by Linear's native mobile/desktop apps — no custom notification system needed
- The `| reason` format in specs is backward-compatible — sections without `|` just won't have tooltip reasons
