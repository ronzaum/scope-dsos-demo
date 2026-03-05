# DS-OS Frontend — Product Requirements Document
# Date: 2026-03-03

---

## What We're Building

A local React frontend that connects to the DS-OS API server (`localhost:3001`) and displays live deployment data. When a slash command runs in Claude Code and updates a markdown file, the dashboard reflects the change within ~5 seconds.

This is the internal visibility layer for the deployment team. Read-only. All writes happen through Claude Code commands.

---

## Starting Point

**Codebase:** Clone `aidapt-stream` (https://github.com/ronzaum/aidapt-stream) into this repo. It already has:
- 4 pages: Overview, Client Detail (6 tabs), Terminal, Playbook
- Correct data model (Bureau Veritas, TÜV SÜD, Intertek)
- Dark theme, Inter + JetBrains Mono, Linear/Vercel aesthetic
- React 18 + TypeScript + Vite + Tailwind + shadcn/ui

**API server:** Already exists at `api/server.js`. Has:
- Endpoints: `/api/overview`, `/api/clients`, `/api/clients/:slug`, `/api/playbook`, `/api/methods`, `/api/system/log`
- JWT auth with role-based access (auto-login as DS — no login screen)
- File watching via chokidar — auto-reloads on markdown changes
- Full markdown parsers for clients, playbook, system

---

## Information Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR (fixed left)                                            │
│ ┌─────────────────┐                                             │
│ │ DS-OS            │                                            │
│ │ Scope AI         │                                            │
│ ├─────────────────┤                                             │
│ │ ● Overview       │ ← active state: blue left border           │
│ │   Clients        │                                            │
│ │   Templates      │ ← NEW                                     │
│ │   Terminal       │                                            │
│ │   Playbook       │                                            │
│ ├─────────────────┤                                             │
│ │ 🟢 Live          │ ← connection indicator (green/grey)        │
│ │ DS · Jordan Chen │                                            │
│ └─────────────────┘                                             │
└─────────────────────────────────────────────────────────────────┘

PAGE 1: OVERVIEW  /
├── Stat Cards (top row, 5 across)
│   ├── Active Deployments (count)
│   ├── Avg Onboarding (days)
│   ├── Inspection Improvement (%)
│   ├── Playbook Entries (count)
│   └── Templates per Client (avg — customisation density signal)
├── Deployment Table (full width)
│   ├── Columns: Client | Stage | Health | Contract | Users | Adoption | Issues | Next Action
│   ├── Row click → opens Quick-View Panel (right side)
│   └── Row click-through → navigates to Client Detail
├── Signal Feed (right column or below table)
│   └── Timestamped activity stream (newest first, top 15)
└── Quick-View Panel (slide-out, right side) ← NEW
    ├── Client name + stage badge + health dot
    ├── Key metrics (adoption %, users, contract)
    ├── Last 2-3 interactions
    ├── Open issues (red if blocking)
    └── "View full detail →" link

PAGE 2: CLIENT DETAIL  /clients/:slug
├── Header: client name + stage badge + health dot + contract value
└── Tab Navigation
    ├── Tab: Overview
    │   ├── Profile card (sector, size, inspection types, geography)
    │   ├── Commercial card (contract, value, term, renewal, buyer)
    │   ├── Deployment state card (stage, phase, features, users, adoption)
    │   ├── KPI Indicators ← NEW
    │   │   ├── Leading indicators (daily active users, template completion, feature adoption)
    │   │   └── Lagging indicators (report time reduction, throughput, error rate)
    │   └── Intervention Trigger Log ← NEW
    │       └── Timestamped entries: metric crossed threshold → action → outcome
    ├── Tab: Constraint Map
    │   ├── User map table (type, count, pain point, adoption signal)
    │   ├── Solutions audit (current tools, friction points with severity)
    │   ├── Product match table (need vs capability, fit, priority)
    │   └── Wedge use case callout
    ├── Tab: Deployment Plan
    │   ├── Method card + rationale
    │   ├── Phase timeline (visual horizontal bar: green/amber/grey) ← CHART
    │   ├── Feature table per phase
    │   └── Risk register table
    ├── Tab: Issues
    │   ├── Filters: status (open/resolved), severity (blocking/degrading/minor)
    │   └── Issue list (expandable: description, root cause, resolution, cross-client scan)
    ├── Tab: Interactions
    │   └── Vertical timeline (date, source icon, summary) — newest first
    └── Tab: Stakeholders
        └── Cards: name, role, priority, trust level (visual bar), comms style, notes

PAGE 3: TEMPLATES  /templates  ← NEW PAGE
├── Template Index (filterable list)
│   ├── Columns: Name | Inspection Type | Standard | Status (Draft/Complete/QA'd/Live)
│   ├── Filter by status
│   └── Click to expand full spec
├── Pattern Detection ← NEW
│   ├── Overlap Map (which templates share fields/sections/standards)
│   ├── Reusable Element Groups (common field clusters across templates)
│   └── Scalability Signals (% of new template buildable from existing elements)
└── Data: /api/templates, /api/templates/:slug, /api/templates/patterns

PAGE 4: TERMINAL  /terminal
├── Terminal Window (left 60%)
│   ├── Sequence 1: New Client Pipeline (/Start → /Client_Intel → /Deploy_Plan)
│   ├── Sequence 2: Problem Resolution (/Log_Issue → /Resolve → /Update_Playbook)
│   └── Auto-loops with 5s pause between sequences
└── Affected Files Panel (right 40%)
    └── File paths with READ (blue) / WRITE (green) badges

PAGE 5: PLAYBOOK  /playbook
├── Section 1: Deployment Patterns (card grid)
│   └── Cards: name, source client, "applies when", confidence badge, expandable detail
├── Section 2: Resolution Patterns (card grid)
│   └── Cards: name, category, root cause, confidence, conditions, prevention
├── Section 3: Method Registry (table)
│   ├── Columns: Method | Status | Conditions | Success Rate | Last Validated
│   └── Operational Rules (expandable list below table)
└── Section 4: Cross-Client Insights
    ├── Comparison table (adoption, improvement, issues, method per client)
    ├── Templates per client vs contract value (customisation density) ← NEW
    ├── Client attribution on pattern cards ← NEW
    ├── Confidence derived from cross-client validation ← NEW
    └── Comparison charts ← NEW (bar charts via Recharts)
```

---

## What Needs to Happen

### 1. Wire to Live Data

Replace all hardcoded arrays and objects with API calls. Every page fetches from `localhost:3001` and polls every 5 seconds.

**Auth handling:** On app load, silently POST to `/api/auth/login` with `{ name: "DS", role: "ds" }`, store the JWT in memory, attach as Bearer token to all subsequent requests. No login screen. No user interaction.

**Fallback:** If the API is unreachable, fall back to the existing hardcoded data so the app still renders. Show a small connection indicator in the sidebar: green dot + "Live" when connected, grey dot + "Offline" when using fallback.

**Pages and endpoints:**
| Page | Endpoint | Notes |
|------|----------|-------|
| Overview | `GET /api/overview` | Stats, deployment table, signal feed |
| Client Detail | `GET /api/clients/:slug` | All 6 tabs (Overview, Constraint Map, Deployment Plan, Issues, Interactions, Stakeholders) |
| Terminal | None | Self-contained animation, no API needed |
| Playbook | `GET /api/playbook` + `GET /api/methods` | Patterns, methods, rules, cross-client insights |

### 2. Client Quick-View Panel

On the Overview page, clicking a client row in the deployment table opens a slide-out panel on the right side. The panel shows a scannable summary:

- Client name + stage badge + health dot
- One-line status summary
- Key metrics (adoption %, users active/total, contract value)
- Last 2-3 interaction log entries
- Open issues count (red if blocking)
- "View full detail →" link to the Client Detail page

Click outside the panel or press Escape to close it. Clicking another client row swaps the panel content.

**Data source:** The overview endpoint already returns deployment summaries. For the expanded panel (recent interactions, issues), fetch from `/api/clients/:slug` on panel open.

### 3. Template & Report Browsing

**New API endpoints needed:**
- `GET /api/templates` — list all templates from `/data/templates/` with status and metadata
- `GET /api/templates/:slug` — full template content

**Frontend:** Add a Templates section. Could be a new nav item or a tab within an existing page. Shows:
- Template index: name, inspection type, standard, status (Draft / Complete / QA'd / Live)
- Click to expand full template spec
- Filter by status

### 4. KPI Indicators + Intervention Triggers

Fold into **Client Detail → Overview tab**, not a separate page. For clients with deployment data, show:

- Leading indicators (daily active users, template completion rate, feature adoption) alongside lagging indicators (report time reduction, inspection throughput, error rate)
- Intervention trigger log: timestamped entries where metrics crossed a threshold — what was detected, what action was taken, outcome

**Data source:** Derive from existing client data. Leading indicators from deployment state + interaction history. Intervention triggers from issue log entries that show metric-driven detection.

### 5. Live Diagrams & Charts

Add charts where the data supports it — not decorative. Candidates:

- **Adoption trend line** (Client Detail): adoption % over time, derived from interaction history entries that mention adoption changes
- **Phase timeline** (Client Detail → Deployment Plan tab): visual horizontal bar showing Phase 1/2/3 with status colours (complete = green, in progress = amber, planned = grey). Already described in the spec, not yet implemented as a visual
- **Health distribution** (Overview): small donut or bar showing green/amber/red count across all clients
- **Issue resolution rate** (Overview or Client Detail): open vs resolved over time
- **Cross-client comparison** (Playbook): bar chart comparing adoption, improvement, and issue metrics across clients

Use Recharts (already installed in aidapt-stream). Keep charts minimal — no 3D, no animation, same dark theme.

### 6. Enhanced Cross-Company Patterns

The Playbook page already has deployment patterns, resolution patterns, method registry, and a cross-client insights table. Enhance with:

- Client attribution on each pattern card (which client contributed this learning)
- Confidence indicators derived from how many clients have validated the pattern
- Charts comparing key metrics across clients (see #5 above)

### 7. Template & Report Pattern Detection

Surface the output of `/Pattern_Check` visually. Shows overlaps, reusable elements, and structural similarities across the template library.

**Prerequisite — command output persistence:**
`/Pattern_Check` currently runs in conversation only. It needs to write its analysis to `/data/templates/_pattern_analysis.md` so the API can read it. This is a small change to the slash command.

**New API endpoint:**
- `GET /api/templates/patterns` — parsed pattern analysis (overlaps, shared fields, reusable element groups)

**Frontend — within the Templates section:**
- **Overlap map:** Which templates share fields, sections, or standards. Show as a matrix or grouped cards (e.g., "Pressure Vessel API 510 and Lifting Equipment LOLER share 60% of fields")
- **Reusable element groups:** Common field clusters that appear across multiple templates (e.g., "Equipment Identification" block appears in 4 templates). These are candidates for shared components
- **Scalability signals:** How much of a new template can be built from existing elements vs built from scratch. Shows as a percentage or bar per template

**Data source:** `/data/templates/_pattern_analysis.md` — written by `/Pattern_Check`, parsed by the API, served as JSON. Updates every time `/Pattern_Check` runs.

---

## What We're NOT Building

- **Natural language querying** — deferred. Only searches local data, not high enough value for Friday
- **Role switching / role-based views** — deferred. Everyone sees the DS view
- **Login screen** — auto-login only
- **Public deployment** — runs locally. Deploy later if needed
- **New pages from scope-os-deploydemo** — no Maturity Model, Commercial Alignment, etc. The concepts that are useful (KPI indicators) are folded into existing pages

---

## Technical Decisions

- **No new framework.** Use what aidapt-stream already has: React, Vite, Tailwind, shadcn/ui, Recharts
- **Shared data fetching hook.** One `useApiData(endpoint, fallback)` hook that handles polling, auth token injection, and fallback. All pages use this
- **Auth token in memory only.** No localStorage, no cookies. Token lives in a React context/ref. Page refresh re-authenticates silently
- **API changes are minimal.** New endpoints are for templates and pattern analysis. Everything else already exists
- **Charts use Recharts.** Already a dependency. Dark theme, minimal style, no heavy customisation

---

## Build Sequence

1. **Clone + verify** — Pull aidapt-stream into this repo, confirm it runs with `npm run dev`
2. **Auth + data hook** — Build the auto-login flow and `useApiData` hook with polling + fallback
3. **Wire Overview** — Replace hardcoded overview data with live API calls
4. **Wire Client Detail** — All 6 tabs pulling from `/api/clients/:slug`
5. **Wire Playbook** — Pull from `/api/playbook` + `/api/methods`
6. **Client quick-view panel** — Slide-out on Overview client row click
7. **Template endpoints** — Add `GET /api/templates`, `GET /api/templates/:slug`, and `GET /api/templates/patterns` to the API server
8. **Template browsing UI** — Frontend template list + detail view
9. **Pattern detection UI** — Overlap map, reusable element groups, scalability signals within Templates section
10. **Update `/Pattern_Check`** — Write output to `/data/templates/_pattern_analysis.md` so the API can serve it
11. **Charts** — Add adoption trend, phase timeline, health distribution, cross-client comparison
12. **KPI indicators** — Leading/lagging pairs + intervention triggers on Client Detail
13. **Polish** — Connection indicator, loading states, error handling, fallback verification

---

## How to Run (Once Built)

Terminal 1:
```
cd api && npm run dev
```

Terminal 2:
```
cd frontend && npm run dev
```

Open `http://localhost:5173` in browser. Dashboard updates live as slash commands modify markdown files.

---

## Success Criteria

- Run a DS-OS slash command → see the dashboard update within 5 seconds
- Click a client on Overview → quick-view panel shows summary instantly
- Browse templates with status filtering
- Charts render from real data, not hardcoded values
- App works offline (falls back to static data) and online (live polling)
- Looks the same as the Lovable demo — dark, clean, data-dense
