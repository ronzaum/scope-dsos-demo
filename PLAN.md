# FE-023: Playbook → Field Notes Refactor

**Overall Progress:** `100%`

Addresses `issues/023-field-notes-refactor.md` | Linear: RON-32

## TLDR

Rename the "Playbook" page to "Field Notes" with a Footprints icon. Remove decorative sections (Operational Rules, Cross-Client Comparison chart). Move reference content (Client Type Definitions, Client Type Insights) to TIC Playbook. Surface the Metrics Benchmarks table that's already parsed but never rendered. Add source-to-client links and last-updated timestamps on pattern cards.

## Critical Decisions

- **"Field Notes" as name** — distinct from "TIC Playbook", grounded in deployment experience rather than industry reference
- **Footprints icon** — visually unique in the sidebar, reinforces field/ground-truth connotation
- **Client Type data moves to Knowledge API** — rather than fetching from playbook API on the Knowledge page, move the data to `/api/knowledge` response so TIC Playbook gets it natively
- **Cross-Client Comparison chart removed entirely** — it duplicates Overview data. Not relocated, just removed from Field Notes
- **Route changes from `/playbook` to `/field-notes`** — clean break, low risk for demo app

## Execution Groups

**Group A: Rename + Clean Up Field Notes** — Sidebar rename, icon swap, route change, remove Operational Rules and Cross-Client chart, add Metrics Benchmarks table, add source links and timestamps. Steps 1-5.

**Group B: Move Client Type Sections to TIC Playbook** — Extend Knowledge API to include client type data from playbook files, render in TIC Playbook page, remove from Field Notes. Steps 6-8.

## Tasks

### Group A: Rename + Clean Up Field Notes

- [x] 🟩 **Step 1: Rename sidebar entry and swap icon**
  - [x] 🟩 In `frontend/src/components/AppSidebar.tsx`: change `title: "Playbook"` to `title: "Field Notes"`, change `path: "/playbook"` to `path: "/field-notes"`, replace `BookOpen` import with `Footprints`

- [x] 🟩 **Step 2: Update route in App.tsx**
  - [x] 🟩 In `frontend/src/App.tsx`: change the Playbook route path from `/playbook` to `/field-notes`

- [x] 🟩 **Step 3: Update page title, subtitle, and remove decorative sections**
  - [x] 🟩 In `frontend/src/pages/Playbook.tsx` (or rename file to `FieldNotes.tsx`): change h1 to "Field Notes", subtitle to "Lessons from the field — what worked, what didn't, what to do next"
  - [x] 🟩 Remove the Operational Rules accordion (the `rules` state, the `expandedRule` state, and the entire `{rules.length > 0 && ...}` block inside the Method Registry section)
  - [x] 🟩 Remove the Cross-Client Comparison chart section (the `overviewData` fetch, the `CrossClientComparison` import, and the entire `{overviewData.deployments && ...}` block)
  - [x] 🟩 Remove the Cross-Client Insights section (Client Type Insights and Client Type Definitions blocks) — these move to TIC Playbook in Group B

- [x] 🟩 **Step 4: Add Metrics Benchmarks table**
  - [x] 🟩 In `frontend/src/pages/Playbook.tsx`: the API already returns `metricsBenchmarks` (parsed in `api/parsers/playbook.js` from the table in `deployment_playbook.md`). Render it as a table section after Resolution Patterns. Columns: Metric, one column per client, Target. Same table styling as Method Registry
  - [x] 🟩 Update `frontend/src/data/fallbacks.ts`: add `metricsBenchmarks` array to `FALLBACK_PLAYBOOK` matching the 4-row table in `data/playbook/deployment_playbook.md`

- [x] 🟩 **Step 5: Add source links and last-updated timestamps to pattern cards**
  - [x] 🟩 In the `PatternCard` component: parse the `source` prop to extract client name and date (format is "Client Name | YYYY-MM-DD"). Render the client name as a `<Link>` to `/clients/{slug}` (map known client names to slugs: "Bureau Veritas" → "bureau_veritas", "TÜV SÜD" → "tuv_sud", "Intertek" → "intertek"). Render the date as a "Last updated" label below the source line
  - [x] 🟩 For Resolution Patterns: source format is "Client ISSUE-XXX | YYYY-MM-DD" — extract client name before "ISSUE", link to client page, show date

### Group B: Move Client Type Sections to TIC Playbook

- [x] 🟩 **Step 6: Extend Knowledge API to include client type data**
  - [x] 🟩 In `api/parsers/knowledge.js`: extended `buildKnowledgeResponse` to accept playbook data and append client-types section
  - [x] 🟩 Section follows the existing knowledge section shape: `{ id: "client-types", title: "Client Segmentation", icon: "Users", description: "Client types by scale, inspection workflow, and geography" }`
  - [x] 🟩 Combined Client Type Insights and Client Type Definitions into one section's `data` — insights as introductory points, categories as the structured breakdown

- [x] 🟩 **Step 7: Render client type section in TIC Playbook page**
  - [x] 🟩 In `frontend/src/components/knowledge/SectionExpansion.tsx`: added case for `sectionId === "client-types"` with new `ClientSegmentationSection` component
  - [x] 🟩 Updated `frontend/src/data/fallbacks.ts`: added the client-types section to `FALLBACK_KNOWLEDGE.sections`

- [x] 🟩 **Step 8: Remove client type data from playbook API response**
  - [x] 🟩 In `api/server.js`: strip `clientTypeInsights` and `clientTypeDefinitions` from the `/api/playbook` response via destructuring
  - [x] 🟩 In `frontend/src/data/fallbacks.ts`: removed `clientTypeInsights` from `FALLBACK_PLAYBOOK`
