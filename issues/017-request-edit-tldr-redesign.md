# FE-017: Request Edit Modal — TLDR Auto-Generation + Simplified Layout

**Type:** Improvement | **Priority:** High | **Effort:** Medium

## TL;DR

The "Request Edit" modal currently shows per-section editable fields (Problem, Recommended Fix, Success Criteria, Comment) for every non-green section. Replace this with a single auto-generated TLDR issue body (derived from the coloured dot reasoning) that the user can edit, plus one optional comment box at the bottom. The API endpoint and Linear payload also need updating to match the new shape.

## Current State

- Clicking "Request Edit" opens a modal with a card per flagged section
- Each card has 4 textareas: Problem, Recommended Fix, What Success Looks Like, Comment
- Fields are pre-filled from parser-derived data but individually editable
- API endpoint (`POST /api/templates/:slug/request-edit`) expects `{ templateName, sections: [...] }` with structured per-section data
- Linear issue is built by looping over sections and formatting each as a `### Section Name` block

## Expected Outcome

- **Modal shows one editable textarea** pre-filled with an auto-generated TLDR block:
  - Template name, number of flagged sections
  - Per-section: name, confidence level (colour + label), reason (verbose, not 10-word capped), recommended fix
  - Written in the style of a `/dev:create-issue` TLDR — concise but complete
- **Below it, one optional comment textarea** for free-text context
- **User can edit the TLDR** before sending (not read-only)
- **API endpoint updated** to accept `{ templateName, body: string, comment?: string }` instead of the sections array
- **Linear issue** receives the single TLDR block + optional comment as the description (no structured per-section JSON)
- **Local JSON backup** also stores the new shape

## Files

- `frontend/src/pages/Templates.tsx` — review modal UI (lines 670-757), `reviewSections` state, `handleSendToLinear`
- `api/server.js` — `POST /api/templates/:slug/request-edit` endpoint (lines 580-647)

## Notes

- The confidence data (`reason`, `recommendedFix`, `confidenceLabel`) already exists in the parsed template sections — the TLDR just needs to be composed from it on the frontend before the modal opens
- This is a breaking change to the request-edit API contract — no other consumers exist so migration is clean
- The per-section comment fields are removed; replaced by the single comment box at the bottom
