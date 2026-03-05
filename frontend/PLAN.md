# DS-OS Frontend — Implementation Plan

**Overall Progress:** `100%`

## TLDR

Build the live frontend dashboard for DS-OS. Clone the `aidapt-stream` Lovable demo into this repo, wire it to the existing API server so data flows live (command runs → markdown updates → API detects → dashboard refreshes). Add a Templates page with pattern detection, charts where the data supports them, KPI indicators on client detail, and a client quick-view panel on the Overview. Runs locally on the laptop for Friday.

## Critical Decisions

- **Use `aidapt-stream` as base, not `scope-os-deploydemo`:** aidapt-stream matches the DS-OS data model exactly (same clients, same schema, same 4-page structure). The other repo is a pitch demo with a different information architecture.
- **Run locally, not deployed:** For Friday, everything runs on the laptop (`localhost:5173` + `localhost:3001`). Deploy later if needed.
- **Auto-login as DS, no login screen:** The API requires JWT auth. Frontend silently authenticates on load — no user interaction for auth.
- **KPI indicators folded into Client Detail, not a new page:** Leading/lagging indicators and intervention triggers live on the Overview tab of an existing page.
- **Templates as a new page, pattern detection within it:** One new nav item. Template index + pattern analysis (overlap map, reusable elements, scalability signals) in a single page.
- **No NL querying for now:** Deferred. Only searches local data, not high enough value for Friday.
- **No role switching:** Everyone sees the DS view. RBAC exists in the API but isn't surfaced in the UI.
- **Charts only where data supports them:** Recharts (already installed). No decorative visuals.

## Tasks

- [x] 🟩 **Step 1: Clone + verify**
  - [x] 🟩 Clone `aidapt-stream` repo contents into `frontend/` (src, public, config files)
  - [x] 🟩 Install dependencies (`npm install`)
  - [x] 🟩 Confirm `npm run dev` starts and renders the existing static app at `localhost:5173`
  - [x] 🟩 Confirm API server starts with `cd api && npm run dev` at `localhost:3001`

- [x] 🟩 **Step 2: Auth + data fetching hook + fallback constants**
  - [x] 🟩 Extract existing hardcoded data from aidapt-stream components into `src/data/fallbacks.ts` — these become the offline fallback, not throwaway code
  - [x] 🟩 Create auth context — on app load, POST `/api/auth/login` with `{ name: "DS", role: "ds" }`, store JWT in memory
  - [x] 🟩 Create `useApiData(endpoint, fallback)` hook — polls every 5s, injects Bearer token, falls back to constants on failure
  - [x] 🟩 Add connection indicator to sidebar — green dot + "Live" when API responds, grey dot + "Offline" on fallback

- [x] 🟩 **Step 3: Wire Overview page**
  - [x] 🟩 Replace hardcoded stats, deployments, and signal feed with `useApiData('/api/overview', FALLBACK_OVERVIEW)`
  - [x] 🟩 Add 5th stat card: Templates per Client (placeholder until template endpoints exist in Step 7)
  - [x] 🟩 Map API response fields to existing components (stage badges, health dots, adoption bars)

- [x] 🟩 **Step 4: Client quick-view panel**
  - [x] 🟩 Build slide-out panel component (right side, overlays content)
  - [x] 🟩 Wire to deployment table row click — single click opens panel, fetches `/api/clients/:slug`
  - [x] 🟩 Panel content: name + stage + health, key metrics, last 2-3 interactions, open issues, "View full detail →" link
  - [x] 🟩 Close on click-outside or Escape. Swap content on different row click

- [x] 🟩 **Step 5: Wire Client Detail page**
  - [x] 🟩 Replace hardcoded client data with `useApiData('/api/clients/:slug', FALLBACK_CLIENT)`
  - [x] 🟩 Wire all 6 tabs: Overview, Constraint Map, Deployment Plan, Issues, Interactions, Stakeholders
  - [x] 🟩 Handle null sections (show "Not yet completed. Run the corresponding slash command." placeholder)

- [x] 🟩 **Step 6: Wire Playbook page**
  - [x] 🟩 Replace hardcoded playbook data with `useApiData('/api/playbook', FALLBACK_PLAYBOOK)` and `useApiData('/api/methods', FALLBACK_METHODS)`
  - [x] 🟩 Add client attribution to pattern cards (source client name)
  - [x] 🟩 Add confidence badge colours (High = green, Medium = amber, Low = red)
  - [x] 🟩 Add templates-per-client vs contract value row to cross-client comparison table

- [x] 🟩 **Step 7: Template API endpoints**
  - [x] 🟩 Add template parser in `api/parsers/template.js` — parse template markdown files from `/data/templates/`
  - [x] 🟩 Add pattern analysis parser — parse `/data/templates/_pattern_analysis.md`
  - [x] 🟩 Add `GET /api/templates` endpoint — list all templates with name, type, standard, status
  - [x] 🟩 Add `GET /api/templates/:slug` endpoint — full template content
  - [x] 🟩 Add `GET /api/templates/patterns` endpoint — parsed pattern analysis
  - [x] 🟩 Add `/data/templates/` to chokidar watcher for auto-reload
  - [x] 🟩 Add template count to `/api/overview` response — wire the Templates per Client stat card (from Step 3) to real data

- [x] 🟩 **Step 8: Templates page (frontend)**
  - [x] 🟩 Create Templates page component + add to router and sidebar nav
  - [x] 🟩 Template index: filterable list with name, inspection type, standard, status badge
  - [x] 🟩 Click to expand full template spec (inline or modal)
  - [x] 🟩 Status filter (Draft / Complete / QA'd / Live)

- [x] 🟩 **Step 9: Pattern detection UI**
  - [x] 🟩 Overlap map section — which templates share fields/sections/standards (matrix or grouped cards)
  - [x] 🟩 Reusable element groups — common field clusters with count of templates using them
  - [x] 🟩 Scalability signals — % of new template buildable from existing elements (bar per template)

- [x] 🟩 **Step 10: Update `/Pattern_Check` command**
  - [x] 🟩 Modify `.claude/commands/templating/Pattern_Check.md` to write output to `/data/templates/_pattern_analysis.md`
  - [x] 🟩 Define structured output format the API parser expects

- [x] 🟩 **Step 11: Charts**
  - [x] 🟩 Phase timeline (Client Detail → Deployment Plan): horizontal bar per phase, green/amber/grey by status
  - [x] 🟩 Adoption trend line (Client Detail): adoption % displayed via progress bar in Overview tab (no time-series data available to chart)
  - [x] 🟩 Health distribution (Overview): donut chart showing green/amber/red client count
  - [x] 🟩 Cross-client comparison (Playbook): bar chart comparing adoption and open issues per client
  - [x] 🟩 Issue resolution rate (Client Detail → Overview tab): stacked bar showing open vs resolved
  - [x] 🟩 Style all charts: dark theme, minimal, Recharts, no animation

- [x] 🟩 **Step 12: KPI indicators + intervention triggers**
  - [x] 🟩 Add KPI section to Client Detail → Overview tab
  - [x] 🟩 Leading indicators: daily active users, feature adoption %, Phase 2 feature count
  - [x] 🟩 Lagging indicators: report turnaround reduction, issue resolution rate, open issue count
  - [x] 🟩 Intervention trigger log: timestamped entries (issue severity → resolution action → outcome)
  - [x] 🟩 Derive data from existing client fields (deployment state, interaction history, issue log)

- [x] 🟩 **Step 13: Polish**
  - [x] 🟩 Loading states on all data-dependent components (all 6 pages + quick view have skeletons)
  - [x] 🟩 Error handling — graceful fallback, no white screens (apiFetch catches all errors, hook falls back to defaults)
  - [x] 🟩 Verify fallback mode works — useApiData falls back to FALLBACK_* constants when API unreachable
  - [x] 🟩 Verify build compiles clean (`npx tsc --noEmit` + `npx vite build` both pass)
  - [x] 🟩 Visual consistency — all components use existing dark theme classes (border-border, bg-card, text-foreground, etc.)

- [x] 🟩 **Step 14: PRD compliance check**
  - [x] 🟩 Read `frontend/PRD.md` end to end
  - [x] 🟩 Cross-check "What Needs to Happen" sections 1-7 — all implemented (see deviations below)
  - [x] 🟩 Cross-check Information Architecture — all 5 pages, sidebar, quick-view panel present
  - [x] 🟩 Verify "What We're NOT Building" — confirmed: no NL querying, no role switching, no login screen
  - [x] 🟩 Confirm all Success Criteria pass
  - [x] 🟩 Document deviations (below)

### Deviations from PRD

1. **Adoption trend line (Section 5):** No time-series data available in client files — adoption is a current snapshot, not historical. Displayed as progress bar instead of line chart.
2. **Method Registry "Success Rate" column (IA):** API data has `successThresholdForExpansion` but no calculated success rate per method. Column omitted — data doesn't support it.
3. **Sidebar user display:** PRD shows "DS · Jordan Chen" — changed to "DS / Deployment Strategist" since Jordan Chen was from aidapt-stream demo, not DS-OS.
4. **"Clients" sidebar link:** Links directly to Bureau Veritas detail page (first client). No standalone Clients list page — Overview deployment table serves this purpose.
5. **Sidebar `end` matching:** The "Clients" NavLink doesn't use `end` prop, so it highlights when visiting any `/clients/*` path — this is correct UX behaviour.
