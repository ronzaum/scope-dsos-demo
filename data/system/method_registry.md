# Method Registry
# Scope AI — DS-OS
# Last Updated: 2026-02-20

Current approved deployment methods and operational rules. This file is ONLY modified by the `/Pivot` command.

---

## Deployment Methods

### M-001: Phased Rollout by User Group
- **Status:** Active — Recommended Default
- **Conditions:** Enterprise clients (100+ inspectors), multiple user types
- **Sequence:** Pilot cohort (10-15 users) → iterate 2-3 weeks → fix top 3 issues → expand to full user base
- **Minimum pilot duration:** 2 weeks before expansion decision
- **Success threshold for expansion:** 70%+ daily active usage in pilot group
- **Last validated:** Bureau Veritas, 2026-01-20

### M-002: Remote Setup
- **Status:** Active — Restricted
- **Conditions:** ONLY for clients with flexible (non-protocol-driven) inspection workflows, <30 inspectors, and clear simple use case
- **Restriction added:** 2026-01-15 (post TÜV SÜD adoption stall)
- **DO NOT USE FOR:** Protocol-driven clients (ISO, regulatory-mandated sequences), clients with standardised inspection flows, non-English markets without verified 100% localisation
- **Last validated:** TÜV SÜD, 2026-01-15 — NEGATIVE

### M-003: On-Site Embedding
- **Status:** Active — Available
- **Conditions:** High-value contracts (£150k+), protocol-driven clients, change management critical
- **Sequence:** DS on-site weeks 1-4 → observe workflows → configure from observation → iterate with real users → transition to remote support
- **Cost consideration:** Travel and on-site time. Factor into contract margin
- **Last validated:** Not yet used. Recommended for TÜV SÜD recovery

### M-004: Hybrid (Remote + On-Site Sprints)
- **Status:** Active — Available
- **Conditions:** Mid-to-high value, geographic spread, needs hands-on moments but not full embedding
- **Sequence:** Remote configuration → on-site kick-off sprint (3-5 days) → remote support → on-site go-live sprint → remote monitoring → on-site adoption review sprint
- **Last validated:** Not yet used

---

## Operational Rules

### R-001: Pilot Before Full Launch
- **Rule:** Never deploy to all users simultaneously. Always start with a pilot cohort of 10-15 (or fewer if total <20)
- **Rationale:** TÜV SÜD deployed to 20 inspectors in week 1. Problems surfaced but every user had already formed a negative opinion. Bureau Veritas piloted with 15, iterated, then expanded successfully
- **Exceptions:** None approved

### R-002: On-Site Observation for Protocol Clients
- **Rule:** For clients with protocol-driven inspection workflows (ISO, regulatory), template configuration must be based on on-site workflow observation, not documentation alone
- **Rationale:** TÜV SÜD templates were configured from documentation. Missed workflow nuances that inspectors use on autopilot. Digital flow was slower than paper
- **Exceptions:** None approved

### R-003: 100% Localisation Before Deployment
- **Rule:** For non-English markets, verify 100% localisation of ALL user-facing text (including error messages, help docs, edge-case UI states) before deployment
- **Rationale:** TÜV SÜD deployed at 85% German localisation. Remaining gaps in error messages and help text created perception that the product wasn't built for German users
- **Exceptions:** None approved

### R-004: Template Audit in Onboarding
- **Rule:** Collect ALL existing inspection templates from the client before any configuration. Map variants to canonical schema. Build normalisation rules
- **Rationale:** Bureau Veritas had 3 template variants across supervisors. Without the audit, normalisation engine couldn't auto-map
- **Exceptions:** New clients with no existing templates (rare for enterprise)

---

## Change Log

| Date | Change | Evidence | Applied By |
|------|--------|----------|-----------|
| 2025-12-18 | Added R-004 (template audit) | Bureau Veritas ISSUE-001 | DS |
| 2026-01-12 | Added mobile UI testing to deployment checklist | Bureau Veritas ISSUE-002 | DS |
| 2026-01-15 | Restricted M-002 (remote setup) for protocol clients | TÜV SÜD ISSUE-001 | DS via /Pivot |
| 2026-01-15 | Added R-001 (pilot before full launch) | TÜV SÜD full-launch failure | DS via /Pivot |
| 2026-01-20 | Added R-002 (on-site observation for protocol clients) | TÜV SÜD template misconfiguration | DS via /Pivot |
| 2025-11-15 | Added R-003 (100% localisation) | TÜV SÜD ISSUE-002 | DS |
