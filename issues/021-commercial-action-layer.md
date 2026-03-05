# FE-021: Commercial Action Layer

**Type:** Feature | **Priority:** High | **Effort:** Large
**Supersedes:** FE-020 (Commercial Awareness Layer) — revised after exploration to eliminate decorative metrics

## TL;DR

Add a commercial decision-making layer to DS-OS. Every surface answers "what should I work on now and why does it matter commercially?" Replaces the original FE-020 proposal which added visibility without action. Five components: Priority Queue on Overview, commercial signals in Signal Feed, revenue context on templates, template-to-adoption feedback loop, and client file schema expansion to support all of the above.

## Current State

- Overview shows 5 deployment-only stat cards — no commercial metrics, no prioritisation
- Signal Feed surfaces deployment events only — no commercial triggers (renewals, expansion, churn risk)
- Templates exist in isolation — no link to the revenue they protect or the adoption they drive
- Adoption is tracked as a single overall % per client — no per-inspection-type breakdown
- No feedback loop: if a template causes low adoption, the DS doesn't know

## Expected Outcome

### 1. Revenue at Risk + Priority Queue (Overview — replaces 2 stat cards)

**Card A: Revenue at Risk** (replaces Inspection Improvement)
- Computed live: sum contract value for clients where `(renewal < 90 days AND adoption < target)` OR `open blocking issues`
- Shows the total at-risk ARR, not a count
- Clicking opens the Priority Queue

**Card B: Pending Adoption** (replaces Playbook Entries)
- Format: "X users across Y clients blocked behind active phase"
- Each entry links to the specific phase blocker
- Clicking opens the Priority Queue filtered to adoption blockers

**Priority Queue** (prominent panel on Overview, visible by default or on card click):
- Ranked list of clients by urgency score
- Urgency = weighted: renewal proximity + adoption gap (% below target) + open blocking issues + champion risk
- Each row shows: Client | Urgency (high/medium/low) | What's Blocking | Proposed Action | Effort estimate
- **Proposed Actions** generated from:
  - Hard rules: if adoption < target AND renewal < 90d -> "resolve blockers before renewal conversation"
  - Hard rules: if adoption > target AND no blockers -> "prepare expansion brief for [economic buyer]"
  - Playbook pattern matching: pull from `resolution_patterns.md` — "last time adoption stalled at X%, the fix was Y"
  - Both rule-based and precedent-based, with rules as the floor and playbook as the enrichment

### 2. Commercial Signals in Signal Feed

Add alongside existing deployment signals (same visual treatment):
- Renewal approaching (< 90 days from renewal date)
- Adoption crossing expansion threshold (e.g., > target % + no blocking issues)
- Pipeline stage change
- Champion or economic buyer change
- **Expansion criteria met** — when adoption > target AND zero blocking issues AND renewal > 90d, signal includes economic buyer name and expansion potential value

### 3. Revenue Context on Templates

When viewing a template spec (template library or templating workflow), show a context bar:
- Which client(s) this template covers
- User count on this inspection type
- Contract value (ARR) attached to that client
- Adoption % on this inspection type vs target

Computed by matching template `[type]_[standard]` to client deployment state (features live -> inspection types -> user count -> contract value).

### 4. Template Quality to Adoption Feedback Loop

**Step A — Per-inspection-type adoption tracking:**
Extend client file Deployment State to track adoption per feature/inspection type, not just overall:
```markdown
## Deployment State
- **Adoption by type:**
  - Construction defect reports: 91% (38/42 users)
  - Anomaly detection: 76% (34/45 users)
  - Data normalisation: 88% (40/45 users)
```

**Step B — Low-adoption signal:**
When any inspection type drops >10% below client's overall adoption average, generate a signal linking to the relevant template spec.

**Step C — Resolution tracking:**
If the DS revises a template after a low-adoption signal, the issue log captures it. When adoption recovers, the playbook captures the pattern (e.g., "anomaly detection templates need X to drive adoption").

This closes the loop: template quality -> adoption -> revenue, and back.

### 5. Client File Schema Expansion (infrastructure)

Add to each client file's Commercial section:
- `Pipeline stage:` (Prospect | Qualified | Proposal | Active | Expanding | Renewing)
- Ensure `Expansion potential:` is present and consistent across all 3 demo files

Add to each client file's Deployment State:
- `Adoption by type:` — per-inspection-type adoption breakdown (simulated data for demo)

## Files

- `frontend/src/pages/Overview.tsx` — replace 2 stat cards, add Priority Queue panel
- `frontend/src/components/PriorityQueue.tsx` — new component: ranked client list with urgency, blockers, proposed actions
- `frontend/src/data/fallbacks.ts` — update fallback shape for new stats + priority queue
- `api/server.js` — update `/api/overview` to compute revenue-at-risk, pending adoption, urgency scores, proposed actions
- `api/parsers/` — commercial parser for contract values, expansion potential, per-type adoption; action generator (rules + playbook lookup)
- `data/clients/bureau_veritas.md` — add pipeline stage, per-type adoption, ensure expansion potential
- `data/clients/intertek.md` — add pipeline stage, per-type adoption, ensure expansion potential
- `data/clients/tuv_sud.md` — add pipeline stage, per-type adoption, ensure expansion potential
- Template library views (TBD) — revenue context bar component

## Notes

- Priority Queue proposed actions use both hard rules (floor) and playbook pattern matching (enrichment). Rules guarantee a suggestion always exists; playbook adds "we've seen this before, here's what worked"
- No new pages — commercial layer woven into existing Overview, Signal Feed, and template surfaces
- Per-type adoption data is simulated for demo clients but the parsing/aggregation is real
- This supersedes FE-020. The original added visibility; this adds decision-making
- Jonathan's bar: "a DS understands the commercial consequence of every action." Every component here connects work to revenue impact
