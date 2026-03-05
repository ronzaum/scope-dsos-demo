# FE-020: Commercial Awareness Layer — DS-OS Second Function

**Type:** Feature | **Priority:** High | **Effort:** Medium

## TL;DR

DS-OS currently covers only one of the two core DS functions Jonathan described: templating (technical configuration). The second — commercial awareness (pipeline value, adoption-to-revenue link, expansion signals) — is missing as a workflow. This issue adds the commercial lens to existing surfaces without building a separate CRM or new pages.

## Current State

- Client files have a static Commercial section (contract value, term, renewal date) — records the deal after it's done, doesn't track the journey
- Overview page shows 5 deployment-only stat cards — no commercial metrics
- Signal Feed surfaces deployment events only — no commercial signals (renewals, expansion triggers, churn risk)
- The system tracks adoption as a deployment metric but doesn't connect it to revenue impact

## Expected Outcome

### 1. Overview Stat Cards — Replace 2 of 5

Keep: Active Deployments, Avg Onboarding, Templates per Client

Replace **Inspection Improvement** with **Pipeline Value**:
- Total active ARR across all clients (sum of contract values)
- Expansion potential shown separately (sum of expansion estimates)
- Per-client breakdown available on hover or in client detail

Replace **Playbook Entries** with **Pending Adoption**:
- Format: "X users / Y clients" not yet onboarded
- Counts users in pipeline who haven't hit active status
- Drives urgency — this is the work ahead

### 2. Client File Commercial Section — Expand Schema

Add to the existing Commercial section in each client file:

```markdown
## Commercial
- **Contract status:** Active — Phase 2
- **Pipeline stage:** Active  ← NEW (Prospect | Qualified | Proposal | Active | Expanding | Renewing)
- **Contract value:** £250,000 annual
- **Expansion potential:** £1.2M  ← ENSURE CONSISTENT across all client files
- **Term:** 18 months
- **Renewal date:** 2027-05-28
- **Economic buyer:** Claire Dupont, VP Digital Transformation
- **Success criteria:** 40% reduction in report turnaround; 90% adoption in 6 months
```

Pipeline stage and expansion potential fields must be present and consistent across all 3 demo client files.

### 3. Signal Feed — Add Commercial Signals

Include alongside existing deployment events:
- Renewal approaching (< 90 days from renewal date)
- Adoption crossing expansion threshold (e.g., > 80% + no blocking issues)
- Pipeline stage change
- Champion or economic buyer change

Same visual treatment as existing signals — no separate feed.

### 4. API — Calculate Live from Markdown

Pipeline Value and Pending Adoption stats must be computed from client markdown files at request time. Same pattern as existing deployment/issue aggregation. No hardcoded fallbacks.

- Parse Commercial section for contract values and expansion potential
- Parse Deployment State for user counts and adoption to calculate pending adoption
- Aggregate across all client files for overview stats

## Files

- `frontend/src/pages/Overview.tsx` — replace 2 stat cards, update types
- `frontend/src/data/fallbacks.ts` — update fallback shape if needed
- `api/server.js` — update `/api/overview` endpoint to compute pipeline value + pending adoption from client files
- `api/parsers/` — may need a commercial parser or extend existing client parser
- `data/clients/bureau_veritas.md` — add pipeline stage, ensure expansion potential
- `data/clients/intertek.md` — add pipeline stage, ensure expansion potential
- `data/clients/tuv_sud.md` — add pipeline stage, ensure expansion potential

## Notes

- No new pages, no new commands, no CRM — commercial awareness woven into existing surfaces
- The commercial data lives in the same client files the DS already works with — single source of truth preserved
- Signal Feed commercial events should feel natural alongside deployment events, not like a bolted-on sales tracker
- Jonathan's point: a DS understands the commercial consequence of every action. This makes that visible without adding process
