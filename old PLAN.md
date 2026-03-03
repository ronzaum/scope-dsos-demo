# DS-OS — Deployment Strategy Operating System
# Build Plan for Scope AI Demo
# Date: 2026-02-26

---

## Goal

Build a Deployment OS that allows **precision, scale, and knowledge retention** across all created deployment strategies at Scope AI.

Every deployment compounds intelligence. The second client onboards with one deployment's learnings. The fifth client starts with four. Nothing stays in someone's head. The system scales deployment capacity without scaling headcount linearly.

---

## What This Is

A working demo of how Scope AI's deployment operations would run as a structured, repeatable system. Two halves:

1. **Deployment Operations** — the client-facing pipeline (new clients, existing clients, problem resolution, expansion)
2. **System Operations** — the internal maintenance layer (process changes, architecture sync, method evolution)

Connected across two surfaces:
- **Cursor / Claude Code** — the backend. Where the Deployment Strategist runs commands, analyses clients, builds plans, resolves issues
- **Lovable** — the frontend. Where the full startup sees deployment states, inputs information, tracks KPIs

---

## Architecture

### Data Model — Markdown as Database

All state lives in markdown files. No external database needed. Files ARE the database.

```
/data/
├── clients/                    # One file per client — single source of truth
│   ├── bureau_veritas.md       # Active deployment, Phase 2
│   ├── intertek.md             # New inbound, intake stage
│   └── tuv_sud.md              # Problem state, adoption stalled
├── playbook/
│   ├── deployment_playbook.md  # Patterns, methods, what works by client type
│   ├── resolution_patterns.md  # Issue types and proven solutions
│   └── client_type_definitions.md  # Segmentation rules
└── system/
    ├── system_log.md           # All system-level changes
    ├── method_registry.md      # Current deployment methods and rules
    └── architecture.md         # How DS-OS itself operates
```

### Slash Command Pipeline

**Deployment Operations (client-facing):**

| Command | Purpose | Reads | Writes |
|---------|---------|-------|--------|
| `/Start` | Entry point: new, update, or problem | Nothing (creates) or client file | Client file (creates or loads) |
| `/Client_Intel` | Deep company research | Web + existing client file | Client file (intel section) |
| `/Constraint_Map` | User mapping + solutions audit + product match | Client file + playbook | Client file (constraint map) |
| `/Deploy_Plan` | Synthesise full deployment plan | Client file + playbook + method registry | Client file + standalone plan doc |
| `/Log_Issue` | Problem intake and classification | Client file | Client file (issue log) |
| `/Resolve` | Problem resolution with cross-client scan | Client file + all client files + playbook | Client file (resolution) + playbook |
| `/Update_Playbook` | Compound learnings after resolution or milestone | Client file + current playbook | Playbook files |
| `/Status` | Pull up any client's current state | Client file | None (display only) |

**System Operations (internal):**

| Command | Purpose | Reads | Writes |
|---------|---------|-------|--------|
| `/Pivot` | Universal method/rule change | Method registry + all client files | Method registry + flags affected clients |
| `/System_Review` | Architecture audit and sync | All system files + commands | System log + architecture doc |
| `/Explore` | Investigation mode — no implementation | Whatever is relevant | None |

### Pipeline Flows

**New Client:**
`/Start (new)` → `/Client_Intel` → `/Constraint_Map` → `/Deploy_Plan`

**Existing Client — Problem:**
`/Start (problem)` → `/Log_Issue` → `/Resolve` → `/Update_Playbook`

**Existing Client — Update/Expansion:**
`/Start (update)` → relevant command based on context

**System Change:**
`/Pivot` (method/rule changes) or `/System_Review` (architecture audit)

### Two-Way Operation

The system mirrors the hiring workflow's governance pattern:

**Deployment half:**
- Commands run sequentially with gates between them
- DS reviews each output before advancing
- Playbook compounds automatically after every resolution or milestone

**System half:**
- `/Pivot` shows diff of what will change before applying
- `/System_Review` proposes changes in plain language, waits for confirmation
- `/Explore` investigates without implementing
- No silent auto-edits to methods or architecture

---

## Roles & Permissions (Lovable Frontend)

| Role | View | Input | Edit |
|------|------|-------|------|
| Deployment Strategist | All pages | All forms | All fields |
| Forward Deployed Engineer | Client state, diagnostics, issues | Issue logs, technical notes | Client technical fields only |
| Account Executive | Client overview, commercial metrics | Commercial notes, renewal flags | None |
| Leadership | Overview, KPIs, playbook, expansion | Strategic notes | Playbook (with DS approval) |
| View Only | Overview dashboard only | None | None |

Editor capabilities are role-selected. Not everyone edits.

---

## Lovable Frontend — 4 Pages for Demo

### Page 1: Overview Dashboard
- Active deployments table (client, stage, health, contract value, next action)
- 4 stat cards: deployments live, avg onboarding time, inspection improvement, playbook entries
- Signal feed: recent activity across all clients

### Page 2: Client Detail View
- Full client state: profile, constraint map, deployment plan, issues, metrics
- Interaction timeline
- Stakeholder map
- Editable fields based on user role

### Page 3: Command Terminal
- Shows slash commands running in real time
- Animated terminal output
- Links to affected client files and playbook entries

### Page 4: Playbook & Learnings
- Deployment patterns by client type
- Resolution patterns by issue type
- Method registry (what /Pivot changes)
- Cross-client insights

---

## Pre-loaded Demo Data

### 3 Simulated Clients

**Bureau Veritas** — Active, Phase 2 (the success story)
- Largest TIC company globally
- Contract: £250k annual, 18-month term, 3 months in
- 45 inspectors, 8 supervisors, 3 compliance leads
- Report generation and anomaly detection live
- 2 issues resolved, 1 open (legacy CMMS integration)
- Playbook contribution: "Field inspectors need mobile-first UI, not desktop adaptation"

**Intertek** — New inbound (the fresh pipeline)
- Third largest TIC company
- Contacted via BD, first meeting scheduled
- Currently using SafetyCulture for basic checklists, needs enterprise-grade
- No deployment history yet
- Perfect for demoing the full `/Start → /Client_Intel → /Constraint_Map → /Deploy_Plan` flow

**TÜV SÜD** — Problem state (the resolution story)
- German TIC company, strong in automotive and industrial
- Contract: £150k annual, 12-month term, 5 months in
- Adoption stalled: 20 inspectors, only 8 active
- Root cause: no on-site champion, training was remote-only
- Perfect for demoing `/Log_Issue → /Resolve → /Update_Playbook` flow

### Simulated Past Data
- Bureau Veritas has 3 months of interaction history, 2 resolved issues with full resolution chains
- TÜV SÜD has 5 months of history showing the gradual adoption decline
- Playbook has entries contributed by past deployments (Bureau Veritas data format learnings, TÜV SÜD language support resolution)
- Method registry has 3 deployment methods with success rates based on simulated past clients

---

## Demo Scenarios for the Call

### Scenario 1: "New client just contacted us"
Run: `/Start (new: Intertek)` → `/Client_Intel` → show how it builds the full intelligence profile → `/Constraint_Map` → show user mapping and product fit → `/Deploy_Plan` → show the synthesised deployment plan
**Point:** This is repeatable. Every client gets the same rigour. The playbook makes each one faster.

### Scenario 2: "We have a problem in a live deployment"
Run: `/Start (problem: TÜV SÜD)` → `/Log_Issue` → show classification and severity → `/Resolve` → show cross-client scan finding similar patterns from Bureau Veritas → show action plan → `/Update_Playbook` → show how the learning compounds
**Point:** Problems become institutional knowledge. The next client with adoption issues starts with this solution.

### Scenario 3: "Show me any deployment's current state"
Run: `/Status (Bureau Veritas)` → show full state: stage, health, metrics, issues, stakeholders, next actions
**Point:** Nothing lives in someone's head. Any DS can pick up any client.

### Scenario 4: "We need to change our deployment method"
Run: `/Pivot` → show what's changing, which clients are affected, what updates are needed → show the diff
**Point:** One command changes the method everywhere. Consistency at scale.

---

## Build Order (Priority for Speed)

### Must have for demo (build first):
1. CLAUDE.md — system brain
2. `/Start` command — entry point
3. `/Client_Intel` command — the deep dive
4. `/Deploy_Plan` command — the synthesis
5. `/Log_Issue` + `/Resolve` — the problem flow
6. `/Status` command — pull up any client
7. `/Pivot` command — universal change
8. 3 pre-loaded client files with simulated data
9. Playbook with 5+ entries
10. Lovable frontend (4 pages)

### Nice to have (add if time):
- `/Constraint_Map` as full working command (can be combined into /Deploy_Plan for demo)
- `/Update_Playbook` as standalone command
- `/System_Review` and `/Explore`
- Resolution patterns file
- Client type definitions file

---

## Scope AI Context (for CLAUDE.md)

This context makes the system smart about Scope specifically:

- **Industry:** Testing, Inspection, Certification (TIC). $2T compliance layer, 1M+ inspectors still manual
- **Product:** AI-powered inspection automation. Bespoke data layers per client. Error-free reports, normalisation, anomaly detection
- **Growth:** 8x YoY, £10M ARR target 2026, 7 of top 10 TIC clients
- **Funding:** Pre-seed 2024, Seed 2025, Series A imminent (Susa Ventures)
- **Team:** ~15 people. Jonathan Low (CEO, ex-Conjecture), Jakob Cassiman (CTO, ML engineer)
- **Moat:** Depth of per-client customisation. Also the scaling constraint
- **Bottleneck:** Deployment capacity. Each client needs custom workflow mapping. DS-OS exists to systematise this
- **Competitors:** Checkfirst (checklists), SafetyCulture (mobile forms), Lumiform (templates). Scope wins on TIC-native depth
- **Client profile:** Enterprise TIC companies. 100-10,000+ inspectors. Regulated industries. Long sales cycles. High retention once deployed
- **Key metric:** 45% reduction in inspection cycle time for deployed clients

---

## Connection: Cursor ↔ Lovable

For the demo, the connection is conceptual (shown side by side):
1. Run a slash command in Cursor → it updates markdown state files
2. Show Lovable displaying the same data
3. Story: "In production, these sync automatically. The DS works in the terminal. The team sees the dashboard."

The data model is identical in both. Lovable reads the same structure as the markdown files. This means the demo is honest: the architecture works, even if the live sync is future work.
