# FE-013: Confidence Indicators UX — Request Edit to Linear, Problem Tooltips, Batch Review

**Type:** Bug + Improvement | **Priority:** High | **Effort:** Medium

## TL;DR

Three changes to the confidence indicator system shipped in RON-16. Move the Request Edit button next to Regenerate with a review modal that pushes a real Linear issue. Fix tooltips to show the actual problem in under 10 words. Batch all non-green sections into one edit request with auto-generated fix recommendations.

## Current State

- Request Edit button is `text-[9px]` with a tiny pencil icon — easy to miss entirely
- Only appears on individual 🟠 Inferred sections, not on 🟡 Industry Standard (which also need validation)
- Tooltip shows confidence label ("Industry Standard" / "Inferred") but doesn't explain what's actually wrong
- Edit request saves to local JSON — no Linear integration
- One request per section — no batch action

## Expected Outcome

### 1. Request Edit Button — Repositioned + Restyled

- Remove per-chip edit buttons from individual sections
- Single "Request Edit" button next to the Generate/Regenerate button
- Orange accent colour (different from Generate's primary colour)
- Only visible when template has any non-green sections

### 2. Review Modal (on button click)

- Header: "Request Template Edit"
- Shows who it's sent to: Ron Zaum
- Lists ALL non-green sections, each with:
  - **Section name**
  - **Problem** — auto-generated at parse time, <=10 words, editable in modal
  - **Recommended fix** — auto-generated, editable
  - **What success looks like** — auto-generated, editable
  - **Comment** — free text per section, optional
- Confirm button sends the batch

### 3. Linear Integration (real, not simulated)

- On confirm, creates one Linear issue per batch (not per section)
- **Team:** Ron (key: RON)
- **Project:** DS-OS
- **Label:** "Template Fix" (new label, to be created)
- **Assignee:** Ron Zaum
- **Title:** `Template Fix: [template name]`
- **Description:** Markdown-formatted list of all flagged sections with problem/fix/success/comments
- Requires Linear API key in `api/.env` (`LINEAR_API_KEY`)
- API server calls Linear REST API directly from the `request-edit` endpoint

### 4. Tooltip — Problem Description

- Hovering any non-green dot shows a <=10 word problem summary (not the label)
- Example: instead of "Industry Standard", show "Methodology fields not confirmed by client"
- Green dots unchanged (show "Verified" or similar)
- Problem text generated at parse time in the API — new `problem` field on `TemplateSection`

### 5. Post-Send State

- Button changes to "Edit Requested" (disabled/muted styling)
- Resets when the template is regenerated
- Pending indicator visible on the template row

## Data Changes

### API Parser (`api/parsers/template.js`)

Add three new fields to each parsed section:
- `problem` — <=10 word summary of what's wrong, derived from confidence level + section type + reason
- `recommendedFix` — what should be done, derived from confidence context
- `successCriteria` — what "fixed" looks like

### API Endpoint (`api/server.js`)

- Update `POST /api/templates/:slug/request-edit` to:
  - Accept array of sections (batch)
  - Call Linear REST API to create issue
  - Store locally as backup
- Add `LINEAR_API_KEY` to env config
- Create `api/.env` file (gitignored)

### Frontend (`frontend/src/pages/Templates.tsx`)

- Remove per-chip edit buttons (lines ~474-485)
- Add Request Edit button next to Generate/Regenerate (line ~531)
- New review modal component with editable fields
- Update tooltip content to use `problem` field (lines ~465-471)
- Add pending state tracking (editRequested flag)
- Update `TemplateSection` interface with new fields

### Template Data

- Ensure `| reason` text in template markdown is problem-oriented for all non-green sections
- Parser derives `problem`, `recommendedFix`, `successCriteria` from reason + confidence level

## Files

- `frontend/src/pages/Templates.tsx` — button, modal, tooltip, state
- `api/server.js` — endpoint update, Linear API call
- `api/parsers/template.js` — new section fields
- `api/.env` — Linear API key (new file, gitignored)
- `data/templates/example_pressure_vessel_api510.md` — ensure reason text is problem-oriented

## Notes

- Linear MCP tools are available in Claude context but not at browser runtime — API server must call Linear REST API directly
- Keep per-section tooltips — they work well for quick context
- The review modal is the single interaction point for edit requests
