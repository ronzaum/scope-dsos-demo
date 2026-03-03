# DS-OS — Deployment Strategy Operating System
# Scope AI | Operating Instructions
# Last Updated: 2026-03-02

---

## Purpose

DS-OS is the Deployment Operating System for Scope AI. It runs the full lifecycle of client deployments: from first contact through live implementation, issue resolution, account expansion, and intelligence compounding.

**North Star:** Precision, scale, and knowledge retention across all deployment strategies.

Every deployment compounds intelligence. The second client onboards with one deployment's learnings. The fifth starts with four. Nothing stays in someone's head. The system scales deployment capacity without scaling headcount linearly.

---

## How It Works — Five Categories

### Category 1: Setup
Run once at the start of a trial day or when capturing tool mechanics.

| Command | What It Does |
|---------|-------------|
| `/Friday_Context` | Trial day entry point. Capture situation, load knowledge, set eval awareness |
| `/Tool_Setup` | Capture Scope's tool mechanics (Layer 2). Structure freeform input. Re-runnable |
| `/Data_Cleanup` | End-of-session data purge. Lists, confirms, then deletes all session data |

### Category 2: Templating
The core work commands. Build inspection template specifications.

| Command | What It Does |
|---------|-------------|
| `/Template_Spec` | Main work command. Inspection type + context → structured template spec |
| `/Report_Map` | Analyse customer's existing report. Map structure. Feeds into Template_Spec |
| `/Template_QA` | Quality check a template spec (fields, classification, structure, mapping) |
| `/Pattern_Check` | Scan template library for overlaps and reusable elements. Scalability signal |

### Category 3: Strategy (Deployment Operations)
Client-facing pipeline. Runs the work of deploying AI inspection automation to enterprise TIC clients.

| Command | What It Does |
|---------|-------------|
| `/Start` | Entry point. Three modes: new client, existing update, or problem |
| `/Client_Intel` | Deep company/client research and intelligence profile |
| `/Constraint_Map` | User mapping + solutions audit + product match against Scope capabilities |
| `/Deploy_Plan` | Synthesise full deployment plan from all prior context + playbook precedents |
| `/Log_Issue` | Problem intake: source, description, classification, severity, affected users |
| `/Resolve` | Cross-client scan + past solutions + action plan + resolution |
| `/Update_Playbook` | Compound learnings into playbook after resolution or milestone |
| `/Status` | Pull up any client's current state. Display only, no writes |

### Category 4: System Operations
Internal maintenance. Process changes, method evolution, architecture sync.

| Command | What It Does |
|---------|-------------|
| `/Pivot` | Universal method/rule change across all deployments. Shows diff before applying |
| `/System_Review` | Architecture audit. Compare actual state vs documented. Propose fixes |
| `/Explore` | Investigation mode. Analyse a proposed change without implementing anything |

### Category 5: Anytime
Works across all workflows. Can be run at any point.

| Command | What It Does |
|---------|-------------|
| `/Ask_Right` | Contextual question generator. Domain-specific questions for any audience or topic |

---

## Pipeline Flows

**Trial Day:**
`/Friday_Context` → `/Tool_Setup` (when hands-on) → `/Template_Spec` / `/Report_Map` as needed → `/Template_QA` → `/Pattern_Check`

**New Client:**
`/Start (new)` → `/Client_Intel` → `/Constraint_Map` → `/Deploy_Plan`

**Existing Client — Problem:**
`/Start (problem)` → `/Log_Issue` → `/Resolve` → `/Update_Playbook`

**Existing Client — Update or Expansion:**
`/Start (update)` → relevant command based on what changed

**System Change:**
`/Pivot` for method/rule changes | `/System_Review` for architecture audit

**Anytime:** `/Ask_Right` works at any point in any workflow.

Steps cannot be skipped. Each command reads prior outputs before producing its own. The pipeline is the same for every client. Customisation lives inside each step, not across the process.

---

## Data Model

All state lives in markdown files. No external database. Files ARE the database.

```
/data/
├── clients/                        # One file per client (single source of truth)
│   ├── bureau_veritas.md
│   ├── intertek.md
│   └── tuv_sud.md
├── knowledge/                      # Layer 1: Industry knowledge (built pre-trial)
│   ├── scope_product.md            # Scope's product info, features, claims
│   ├── inspection_types.md         # All inspection types (process, fields, instruments, standards)
│   ├── regulatory_standards.md     # All standards (governs, classification, report requirements)
│   └── report_anatomy.md           # Universal report skeleton, variations, good vs bad
├── friday/                         # Trial day infrastructure
│   ├── tool_capture.md             # Layer 2: Scope's actual tool mechanics (captured on-site)
│   ├── trial_log.md                # Timestamped running log of the trial day
│   └── FRIDAY_CHEATSHEET.md        # Single A4 scannable reference for the day
├── templates/                      # Template specification library
│   ├── _template_index.md          # Index of all template specs with status
│   └── [type]_[standard].md        # Individual template specs
├── playbook/
│   ├── deployment_playbook.md      # Patterns and methods by client type
│   ├── resolution_patterns.md      # Issue types and proven solutions
│   └── client_type_definitions.md  # Client segmentation rules
└── system/
    ├── system_log.md               # All system-level changes (timestamped)
    ├── method_registry.md          # Current deployment methods and rules
    └── architecture.md             # How DS-OS operates
```

### Client File Structure

Every client file follows the same schema:

```
# [Client Name]
## Profile — company, sector, size, inspection types, key contacts
## Commercial — contract value, term, renewal date, success criteria, economic buyer
## Deployment State — current stage, phase, features live, user count, adoption %
## Constraint Map — user types, current tools, friction points, product fit matrix
## Deployment Plan — method, feature sequence, timeline, milestones, risk flags
## Issue Log — all issues with ID, status, classification, severity, resolution
## Interaction History — timestamped entries of every significant touchpoint
## Stakeholder Map — key people, what they care about, communication style, trust level
## Playbook Contributions — learnings this client has contributed to the system
```

### Playbook Structure

The playbook is the institutional memory. It contains:
- Deployment patterns that work by client type (enterprise vs mid-market, sector, scale)
- Resolution patterns by issue type (what was tried, what worked, conditions)
- Client type definitions (segmentation rules, expected behaviours, risk profiles)
- Success rates per deployment method (remote, on-site, hybrid, phased)

### Method Registry

The method registry defines HOW deployments are executed. Contains:
- Approved deployment methods with conditions for each
- Default sequencing rules
- Escalation triggers
- Review cadence standards

`/Pivot` is the ONLY command that changes the method registry. Changes propagate universally.

---

## Roles & Permissions

| Role | View | Input | Edit |
|------|------|-------|------|
| Deployment Strategist | All | All | All |
| Forward Deployed Engineer | Client state, diagnostics, issues | Issue logs, technical notes | Client technical fields only |
| Account Executive | Client overview, commercial | Commercial notes, renewal flags | None |
| Leadership | Overview, KPIs, playbook, expansion | Strategic notes | Playbook (with DS approval) |
| View Only | Overview dashboard | None | None |

Editor capabilities are role-selected. Not everyone edits. The Lovable frontend enforces these permissions.

---

## Scope AI Context

This system is built for Scope AI specifically. All commands have this context loaded.

**Industry:** Testing, Inspection, and Certification (TIC). $2T compliance automation layer. 1M+ inspectors globally still working manually.

**Product:** AI-powered inspection automation. Bespoke data layers per client. Key capabilities: error-free report generation, data normalisation, anomaly detection, compliance dashboards. 45% reduction in inspection cycle time for deployed clients.

**Growth:** 8x YoY revenue. On track for £10M ARR 2026. 7 of top 10 TIC companies as clients.

**Funding:** Pre-seed 2024, Seed 2025 (Susa Ventures, 3x valuation step-up), Series A imminent.

**Team:** ~15 people. Jonathan Low (CEO, ex-Conjecture), Jakob Cassiman (CTO, ML engineer). Ex-DeepMind, Amazon, McKinsey in the team.

**Moat:** Depth of per-client customisation. Custom workflow mapping per enterprise client. This is also the scaling constraint: each deployment requires bespoke work that does not scale linearly with headcount.

**Bottleneck this system solves:** Deployment capacity. DS-OS systematises the bespoke elements so the repeatable parts run automatically and the truly custom parts are flagged for DS judgment.

**Competitors:** Checkfirst (digital checklists), SafetyCulture (mobile inspection forms), Lumiform (templates). Scope wins on TIC-native depth and enterprise-grade bespoke layers.

**Client profile:** Enterprise TIC companies. 100 to 10,000+ inspectors. Regulated industries (energy, construction, manufacturing, food safety, automotive). Long sales cycles. High retention once deployed.

---

## Knowledge Base Rules

**Two-layer model:**
- **Layer 1 (Industry Knowledge):** Built pre-trial. Lives in `/data/knowledge/`. Contains: Scope product info, inspection types, regulatory standards, report anatomy. Available from minute 1.
- **Layer 2 (Tool Mechanics):** Captured on-site via `/Tool_Setup`. Lives in `/data/friday/tool_capture.md`. Contains: how Scope's product actually works (UI, workflows, configuration). Makes Layer 1 commands sharper.

**Rules:**
1. Knowledge files are reference material, not state. They don't change during a trial unless factual corrections are needed
2. Every command that needs industry context reads from `/data/knowledge/` before producing output
3. Layer 2 is additive. It refines Layer 1, never replaces it
4. If Layer 2 contradicts Layer 1 (e.g., product doesn't support a claimed feature), flag the gap in `tool_capture.md` — don't modify the knowledge base

---

## Template Library Rules

**Every template spec goes to `/data/templates/`.** No exceptions.

1. One spec per file. Filename: `[type]_[standard].md` (lowercase, underscores)
2. `/data/templates/_template_index.md` is ALWAYS updated when a template is created or its status changes
3. Template statuses: Draft → Complete → QA'd → Live
4. `/Template_QA` validates specs against the knowledge base. Only QA'd specs should be deployed
5. `/Pattern_Check` scans the library for reusable elements. Run after every 2nd template to surface patterns
6. The example template at `example_pressure_vessel_api510.md` is the reference pattern for spec structure

---

## Operating Rules

1. Every command reads prior state before producing output
2. Every command writes its output to the relevant state file immediately
3. Client files are the single source of truth per client
4. Playbook is the single source of truth for methods and patterns
5. `/Pivot` is the ONLY command that changes method registry rules universally
6. No state lives only in conversation. If it matters, it goes in a file
7. All system-level changes require confirmation before applying (show diff, wait for approval)
8. The pipeline order is fixed. Customisation is per-step, not per-process
9. Cross-client pattern scanning is built into `/Resolve` and `/Update_Playbook`. The system learns from every deployment
10. When writing deployment plans, pull from the playbook first. Don't reinvent what's already proven

---

## Security

Plain-English overview: `SECURITY.md` | Technical reference: `api/security/REFERENCE.md`

**API Authentication:** All API endpoints (except `/api/health` and `/api/auth/login`) require a JWT Bearer token. Login with name + role via `POST /api/auth/login` to get a token (8h expiry).

**Role-Based Access Control:** The 5 roles from the Roles & Permissions table are enforced at the API level. Client detail responses are field-filtered per role. Playbook responses are redacted (client names replaced with anonymous labels) for non-DS roles.

**Audit Logging:** Every API request is logged to `api/logs/audit.log` (JSON lines, gitignored). DS can review via `GET /api/audit`.

**Data Protection:** Client files, trial logs, and audit logs are gitignored — never committed. `/Friday_Context` includes a consent step before any data capture. `/Data_Cleanup` purges all session data at end of day.

---

## Simulated Integrations

For the demo, these integrations are simulated via pre-loaded data in client files:

- **Email** — client correspondence summaries in interaction history
- **Call transcripts** — key quotes and decisions in interaction history
- **CRM** — commercial data in the commercial section of each client file
- **Support tickets** — logged as issues in the issue log
- **Product usage data** — feature adoption and user counts in deployment state

In production, these would sync automatically. For the demo, the data is real in structure and the system treats it as live.
