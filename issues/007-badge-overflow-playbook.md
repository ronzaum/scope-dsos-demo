# FE-007: Coloured badges bleed outside their box (Playbook + remaining pages)

**Type:** Bug | **Priority:** High | **Effort:** Low

## TL;DR
Badge wrapping / overflow persists after the partial fix in FE-006. Coloured boxes still break out of their container or wrap internally — most visibly in the Playbook page where the confidence badge renders a long string like `"High (Bureau Veritas: quick-capture fix drove adoption from stalled to 84%)"`.

## Current State
- Playbook confidence badge spans the full confidence field value from the data, including parenthetical evidence — e.g. `"High (Bureau Veritas: quick-capture fix drove adoption from stalled to 84%)"` — inside a single coloured `<span>`
- That span is missing `whitespace-nowrap`, so the text wraps inside the box
- When content is long enough it also bleeds outside the badge boundary (overflow not constrained)
- Affects any page not covered by FE-006's fix — confirmed in Playbook; may still be present in Overview, ClientQuickView, or other components using inline badge spans

## Expected Outcome
- All coloured badge spans stay on a single line — no internal wrapping
- Badge never bleeds outside its container
- Long confidence evidence strings are either truncated with ellipsis inside the badge, or the evidence portion is rendered outside the badge as plain text

## Files
- [frontend/src/pages/Playbook.tsx](frontend/src/pages/Playbook.tsx) — confidence badge span (line 22); add `whitespace-nowrap` and consider `max-w-[X] truncate` or move evidence text outside the badge
- [frontend/src/index.css](frontend/src/index.css) — shared `.confidence-*` class definitions; ensure `whitespace-nowrap` and `overflow-hidden` are present on all badge base classes
- [frontend/src/components/ClientQuickView.tsx](frontend/src/components/ClientQuickView.tsx) — inline badge spans may also be missing the fix

## Notes
- Related to FE-006 (same root cause, incomplete fix)
- Two acceptable resolutions: (1) add `whitespace-nowrap overflow-hidden text-ellipsis` to the span, or (2) split the confidence field — render only `"High"` in the badge and the evidence as a separate line below
- Option 2 is cleaner for UX if the data model supports it (confidence value is always the first word before the first parenthesis)
- Quick audit of all `<span>` badge usages recommended to confirm no other pages still missing the fix
