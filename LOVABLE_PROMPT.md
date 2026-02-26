# DS-OS — Lovable Build Prompt
# Deployment Strategy Operating System — Frontend Demo

Build a 4-page internal web application called **DS-OS** (Deployment Strategy Operating System) for Scope AI. This is the frontend dashboard that the entire startup uses to see deployment operations, client states, and compounding learnings in real time.

Think of it as the operating dashboard for a deployment team running enterprise AI inspection automation. It looks like Linear meets Vercel's dashboard: dark, clean, data-dense, no fluff.

---

## Design System

**Background:** #0a0a0a (near-black)
**Surface cards:** #111111 with 1px #1a1a1a border
**Text primary:** #e5e5e5
**Text secondary:** #737373
**Accent:** #3b82f6 (electric blue) — used for active states, CTAs, selected items
**Success:** #22c55e (green)
**Warning:** #f59e0b (amber)
**Danger:** #ef4444 (red)
**Font:** Inter for body, JetBrains Mono for data/terminal elements
**Border radius:** 6px (subtle, not rounded-everything)
**No gradients. No illustrations. No decorative elements. No hero sections.**
**Spacing is generous. Let the data breathe.**

---

## Navigation

Left sidebar, fixed. Dark. Minimal.

- **Logo area:** "DS-OS" in monospace, small "Scope AI" underneath in secondary text
- **Nav items:** Overview | Clients | Terminal | Playbook
- **Bottom of sidebar:** User avatar + role badge (e.g., "Deployment Strategist" in blue, "View Only" in grey)
- **Active nav item:** Blue left border accent + white text

---

## Page 1: Overview

**The dashboard. Shows everything at a glance.**

### Top row: 4 stat cards (horizontal)
Each card: dark surface, metric in large font, label underneath, small trend indicator

1. **Active Deployments:** `3` (label: "clients in pipeline")
2. **Avg Onboarding:** `14 days` (label: "intake to Phase 1")
3. **Inspection Improvement:** `37%` (label: "avg report turnaround reduction")
4. **Playbook Entries:** `8` (label: "patterns + rules")

### Active Deployments Table
Full-width table below stat cards.

| Column | Content |
|--------|---------|
| Client | Company name + small sector tag |
| Stage | Pill badge: "Intake" (blue), "Phase 1" (amber), "Phase 2" (green), "At Risk" (red) |
| Health | Dot: 🟢 / 🟠 / 🔴 |
| Contract | £ value |
| Users | Active / Total |
| Adoption | % with mini progress bar |
| Open Issues | Count (red if blocking) |
| Next Action | Short text |

**Data rows:**

1. Bureau Veritas | Phase 2 | 🟢 | £250k | 49/56 | 84% | 1 | "Phase 2 compliance dashboard rollout"
2. TÜV SÜD | Phase 1 | 🔴 | £150k | 10/26 | 40% | 1 (blocking) | "Adoption recovery: on-site sprint"
3. Intertek | Intake | 🟢 | Scoping | — | — | 0 | "First meeting March 5"

Each row is clickable (navigates to Client Detail).

### Signal Feed (right column or below table)
Recent activity stream, newest first. Each entry: timestamp + icon + one-line description.

- `2h ago` 📊 Bureau Veritas adoption at 84% (up from 82%)
- `6h ago` 🔴 TÜV SÜD: Andreas Keller escalating internally — needs visible progress in 6 weeks
- `1d ago` 📧 Intertek: James Wright confirmed March 5 meeting
- `2d ago` ✅ Bureau Veritas ISSUE-002 resolved: quick capture mode shipped
- `3d ago` 📚 Playbook updated: "Phased rollout outperforms full launch" pattern added
- `5d ago` ⚠️ Pivot applied: Remote setup restricted for protocol-driven clients
- `1w ago` 📋 Intertek client file created — inbound via BD campaign

---

## Page 2: Client Detail View

**Deep view of a single client. Shows everything DS-OS knows about them.**

Top of page: client name + stage badge + health dot + contract value

### Tab navigation within the page:
**Overview | Constraint Map | Deployment Plan | Issues | Interactions | Stakeholders**

### Tab: Overview
- Profile card: sector, size, inspection types, geography, source, date created
- Commercial card: contract status, value, term, renewal, economic buyer, expansion potential
- Deployment state card: stage, phase, features (live / configured / planned), users (active / total), adoption %, baseline improvement
- Quick metrics row: 3-4 key numbers in stat cards

### Tab: Constraint Map
- User map table (user type, count, pain point, adoption signal)
- Solutions audit: current tools list, friction points with severity badges
- Product match table: need vs Scope capability, fit (strong/partial/gap), priority
- Wedge use case highlighted in a callout card

### Tab: Deployment Plan
- Method card with rationale
- Phase timeline (visual: 3 horizontal blocks showing Phase 1/2/3 with status indicators — complete/in-progress/planned)
- Feature table per phase
- Risk register table with likelihood, impact, mitigation, status

### Tab: Issues
- Issue list with ID, title, severity badge, status badge (Open/Resolved), date
- Expandable: click an issue to see full detail (description, root cause, resolution, cross-client scan, playbook update)
- Filter by: status (open/resolved), severity (blocking/degrading/minor)

### Tab: Interactions
- Timeline view: vertical timeline with date, source icon, summary text
- Most recent at top

### Tab: Stakeholders
- Card per stakeholder: name, role, priority badge, trust level indicator (bar or dots), communication style, notes
- Trust level: visual indicator from red (very low) through amber to green (high)

### Role-based editing
- Show an "Edit" button on editable fields
- When not in an editor role, show fields as read-only (no edit button)
- Small role badge in top-right: "Editing as: Deployment Strategist"
- Different roles see different edit buttons (defined in CLAUDE.md role permissions)

**Pre-load Bureau Veritas as the default client view. All data from the bureau_veritas.md file.**

---

## Page 3: Terminal

**Shows the slash command backbone. Animated terminal demonstrating how the DS works.**

### Split layout:
- **Left 60%:** Terminal window with dark background (#050505), monospace font, green (#22c55e) command text, white output text
- **Right 40%:** "Affected Files" panel showing which data files the current command reads/writes

### Terminal animation (auto-loops):
The terminal simulates running a deployment command sequence. Each command types out letter by letter (typewriter effect, fast), then the output appears in blocks.

**Sequence 1: New Client Pipeline**
```
$ /Start --mode new --client "Intertek"
> Creating client file: /data/clients/intertek.md
> Client file created. Source: BD outreach
> Next: run /Client_Intel

$ /Client_Intel --client "Intertek"
> Researching: company overview, inspection operations, decision-makers...
> Intelligence profile complete
> Key finding: Currently using SafetyCulture, hitting enterprise limits
> Sector: Consumer products testing (UK + Asia)
> Next: run /Constraint_Map

$ /Deploy_Plan --client "Intertek"
> Reading: client file, playbook, method registry
> Playbook precedent: Bureau Veritas (construction, phased rollout)
> Method selected: Hybrid (remote + on-site sprints)
> Wedge use case: Consumer product testing automation
> Phase 1: 4 weeks, 30 inspectors, mobile capture + reports
> Plan created. 3 risks flagged.
```

Pause 5 seconds, then:

**Sequence 2: Problem Resolution**
```
$ /Start --mode problem --client "TÜV SÜD"
> Loading client: TÜV SÜD
> Status: Phase 1 — STALLED. Adoption: 40%
> 1 blocking issue open: ISSUE-001

$ /Resolve --client "TÜV SÜD" --issue ISSUE-001
> Cross-client scan: checking 2 other clients...
> Pattern match: Bureau Veritas ISSUE-002 (mobile UI friction)
> Playbook: "Mobile UI friction = #1 adoption blocker"
> Root cause: template configuration doesn't match inspector workflow
> Action plan: on-site observation sprint → reconfigure → pilot 5 users → expand
> Playbook update needed: Yes

$ /Update_Playbook --source "TÜV SÜD" --issue ISSUE-001
> New pattern: "Remote deployment limitations for protocol clients"
> Confidence: High (confirmed by cross-client evidence)
> Method registry updated: M-002 restricted for protocol clients
> Playbook updated. Next deployment benefits from this learning.
```

Loop back to Sequence 1 after 5 second pause.

### Affected Files panel (right side)
Update in real time as each command runs:
- Show file path
- Show "READ" (blue) or "WRITE" (green) badge
- Highlight the specific section being updated

---

## Page 4: Playbook & Learnings

**The institutional memory. Everything the system has learned.**

### Three sections:

### Section 1: Deployment Patterns
Card grid. Each card:
- Pattern name (bold)
- Source client(s) + date
- "Applies when" text
- Confidence badge (Low/Medium/High with colour)
- Expand to see full detail

**Cards from deployment_playbook.md:**
1. Template Normalisation (High confidence)
2. Mobile UI Friction = #1 Blocker (High)
3. Phased Rollout Outperforms Full Launch (High)
4. Supervisor Adoption Creates Inspector Pull (Medium)

### Section 2: Resolution Patterns
Same card grid layout. From resolution_patterns.md:
1. Mobile UI Friction — Adoption Blocker (High)
2. Template Configuration Mismatch — Adoption Blocker (Medium)
3. Data Format Inconsistency — Integration Failure (High)
4. Localisation Incomplete — Integration Failure (High)

### Section 3: Method Registry
Table view. From method_registry.md:

| Method | Status | Conditions | Success Rate | Last Validated |
|--------|--------|-----------|-------------|----------------|
| Phased Rollout | Active — Default | Enterprise, 100+ | 1/1 (100%) | BV, Jan 2026 |
| Remote Setup | Restricted ⚠️ | Flexible workflows only | 0/1 (0%) | TÜV SÜD, Jan 2026 |
| On-Site Embedding | Available | Protocol, high-value | Not yet used | — |
| Hybrid | Available | Mid-high value, spread | Not yet used | — |

Below the table: Operational Rules (R-001 through R-004) as expandable list items.

### Bottom section: Cross-Client Insights
A simple metrics comparison table:

| Metric | Bureau Veritas | TÜV SÜD | Intertek | Benchmark |
|--------|---------------|----------|----------|-----------|
| Adoption | 84% | 40% | — | 85%+ |
| Report improvement | 37% | 18% | — | 40%+ |
| Issues resolved | 2/3 | 1/2 | — | All blocking <2 wks |
| Deployment method | Phased ✅ | Remote ❌ | TBD | Phased or hybrid |

---

## Responsive Notes

- Optimised for 1440px viewport (demo on laptop)
- Sidebar collapses to icons on <1024px
- Tables scroll horizontally on mobile
- Terminal animation pauses on hover

---

## Implementation Notes

- All data is hardcoded/simulated. No real API connections needed
- Terminal animation: use setInterval with typewriter effect
- Charts/progress bars: CSS-only or lightweight library (no D3 needed)
- Signal feed: static data, newest first
- Client detail tabs: client-side tab switching, no routing needed per tab
- Total build time target: this is a demo, not production. Prioritise looking real over being real
