# FE-016: Section Hover Tooltip — Show Reason + Action for Non-Green Sections

**Type:** Improvement | **Priority:** High | **Effort:** Small

## TL;DR

Hover tooltip on template sections should show two lines for non-green sections: why it's not green (reason from markdown) and what to do to make it green (auto-generated action). Green sections get no tooltip. No tooltip if reason text is missing.

## Current State

- Tooltip appears on ALL sections (including green)
- Non-green sections show a derived `problem` label that's generic and unhelpful (e.g., "Methodology fields not confirmed by client")
- The actual `| reason` text from the markdown — which is good and specific — is parsed but not displayed in the tooltip
- Green sections show "Verified — {reason}" which isn't needed
- Tooltip content doesn't tell the user what to DO about it

## Expected Outcome

- **Non-green sections only** get a hover tooltip
- **Green sections** — no tooltip at all
- **Tooltip content (two lines):**
  - **Line 1 (Reason):** The verbatim `| reason` text from the markdown (why it's not green)
  - **Line 2 (Action):** Auto-generated instruction for what to do to turn it green (from `recommendedFix` in parser)
- **No tooltip** if the section has no `| reason` text
- Goal: every section should eventually be green after edits — tooltips guide that process

## Context

Jonathan flagged that template quality directly impacts churn. The confidence system exists to surface what needs work, but the current tooltip doesn't help users act on it. This makes the colored dots decorative rather than functional.

## Files

- `frontend/src/pages/Templates.tsx` — tooltip rendering logic (~lines 498-518)
- `api/parsers/template.js` — `deriveSectionMeta()` already generates `recommendedFix`, just needs to reach the tooltip

## Notes

- The `recommendedFix` and `reason` fields already exist in the API response — this is primarily a frontend wiring change
- Keep the existing `recommendedFix` derivation in the parser; it's good enough for the action line
- This is scoped narrowly to the tooltip only — does not touch the review modal, Request Edit button, or Linear integration from issue 013
