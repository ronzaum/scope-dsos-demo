# FE-023: Playbook Page Refactor — Rename to "Field Notes" & Content Audit

**Type:** Improvement | **Priority:** High | **Effort:** Medium
**Related:** FE-007 (badge overflow playbook)

## TL;DR

The "Playbook" page has a naming collision with "TIC Playbook", mixes operational learnings with static reference content, and has decorative sections that don't drive actions. Rename to "Field Notes" with a Footprints icon, remove/relocate weak sections, and surface the metrics benchmarks table that's already parsed but never rendered.

## Current State

- Sidebar shows "Playbook" and "TIC Playbook" — confusingly similar names for different things
- Page contains 5 sections + a chart, but only 3 sections are genuinely actionable (Deployment Patterns, Resolution Patterns, Method Registry)
- **Operational Rules** section displays internal DS-OS system rules (from CLAUDE.md) — no user action comes from reading these here
- **Client Type Definitions** and **Client Type Insights** are static reference material that belongs in TIC Playbook, not in deployment learnings
- **Cross-Client Comparison chart** uses overview data (adoption %, open issues) — it's a status metric, not a playbook learning
- **Metrics Benchmarks** table is parsed by `api/parsers/playbook.js` but never rendered in the frontend
- No links from pattern sources to client pages
- No timestamps showing when patterns were last updated
- Icon is `BookOpen` — generic, doesn't differentiate from TIC Playbook's `Brain`

## Expected Outcome

### 1. Rename & Rebrand
- Sidebar label: "Playbook" -> "Field Notes"
- Icon: `BookOpen` -> `Footprints`
- Page title: "Field Notes"
- Subtitle: "Lessons from the field — what worked, what didn't, what to do next"

### 2. Remove from Field Notes
- Operational Rules accordion (entire section)
- Cross-Client Comparison chart (move to Overview page or remove)

### 3. Move to TIC Playbook
- Client Type Definitions section
- Client Type Insights section
- These need to be added to the Knowledge API response and rendered in the TIC Playbook page

### 4. Add to Field Notes
- Metrics Benchmarks table (data already parsed by API as `metricsBenchmarks`, just needs a UI component)
- Links from pattern source references (e.g. "Bureau Veritas") to `/clients/bureau_veritas`
- "Last updated" date on each pattern card (source data already contains dates)

### 5. Keep as-is
- Deployment Patterns (core content, card format works)
- Resolution Patterns (core content, card format works)
- Method Registry table (core content, table format works)

## Files

### Must change
- `frontend/src/components/AppSidebar.tsx` — rename label, swap icon import
- `frontend/src/pages/Playbook.tsx` — remove Operational Rules, remove Cross-Client chart, remove Client Type sections, add Metrics Benchmarks table, add source links, add timestamps, update title/subtitle
- `frontend/src/App.tsx` — update route path if changing from `/playbook` to `/field-notes`

### May change
- `frontend/src/pages/Knowledge.tsx` — receive Client Type Definitions and Client Type Insights sections
- `api/server.js` — may need to move client type data from `/api/playbook` to `/api/knowledge` response
- `api/parsers/knowledge.js` — add client type sections to knowledge response
- `frontend/src/data/fallbacks.ts` — update fallback data for both pages
- `frontend/src/components/Layout.tsx` — if any playbook references exist in breadcrumbs or headers

## Notes

- The API already parses `metricsBenchmarks` from `deployment_playbook.md` — this is purely a frontend rendering task
- Moving Client Type data to TIC Playbook requires deciding whether it goes through the knowledge API or stays in the playbook API with a separate fetch from the Knowledge page
- The route path change from `/playbook` to `/field-notes` may affect any bookmarks or external links — low risk for a demo app
- Pattern source dates are embedded in the source string (e.g. "Bureau Veritas | 2025-12-18") — may need light parsing to extract
