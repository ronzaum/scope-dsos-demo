# Bureau Veritas

## Profile
- **Sector:** Testing, Inspection, Certification (TIC). Global leader
- **Size:** 83,000+ employees, ~12,000 inspectors across 140 countries, 1,600 offices
- **Inspection types:** Construction & infrastructure, marine & offshore, power & utilities, oil & gas, food safety, consumer products
- **Geography:** Global HQ in Paris. UK operations significant. Pilot focused on UK construction inspections
- **Source:** Inbound via BD. Initial contact through industry event (TIC Council conference)
- **Initial contact:** Claire Dupont, VP Digital Transformation
- **Date created:** 2025-11-15

## Commercial
- **Contract status:** Active — Phase 2
- **Contract value:** £250,000 annual
- **Term:** 18 months (started 2025-11-28)
- **Months in:** 3
- **Renewal date:** 2027-05-28
- **Economic buyer:** Claire Dupont, VP Digital Transformation
- **Success criteria:** 40% reduction in inspection report turnaround time; 90% inspector adoption in pilot group within 6 months
- **Expansion potential:** £1.2M if scaled across UK + France construction division

## Deployment State
- **Stage:** Active Deployment
- **Phase:** Phase 2 — Core Value Delivery
- **Features live:** Report generation (v2, auto-formatting), anomaly detection (configured for construction defects), data normalisation (3 inspection template types)
- **Features in Phase 2:** Compliance dashboard, predictive maintenance flagging
- **Features planned (Phase 3):** Multi-site rollout tooling, cross-project benchmarking
- **Users:** 45 inspectors (38 active daily), 8 supervisors (all active), 3 compliance leads (all active)
- **Adoption:** 84% daily active usage in pilot group. Target: 90%
- **Baseline improvement:** 37% reduction in report turnaround (target: 40%)

## Constraint Map

### User Map
| User Type | Count | Daily Reality | Language | Top Pain Point | Adoption Signal |
|-----------|-------|---------------|----------|----------------|-----------------|
| Field Inspector | 45 | On-site 6-8 hours, needs mobile capture, uploads photos and notes end-of-day | "I just need it to work on my phone" | End-of-day data entry backlog. Photos disconnected from notes | 84% daily active. Mobile UI was the unlock |
| Supervisor | 8 | Reviews 5-8 reports daily, flags non-compliance, reports to compliance | "Show me what's wrong, don't make me read everything" | Scanning 40-page reports for the 3 things that matter | 100% active. Anomaly detection saves 2 hours/day |
| Compliance Lead | 3 | Monthly reporting to regulators, trend analysis, audit prep | "I need to know we're covered before the auditor asks" | Manual aggregation of inspection data across sites | 100% active. Dashboard gives them real-time view |

### Solutions Audit
**Previous tools:** Paper forms (legacy), custom Excel trackers (per supervisor), SAP for asset management (not connected to inspections)
**Friction points:**
- 🔴 End-of-day data entry created 24-hour reporting lag
- 🟠 Photos disconnected from inspection notes (filed separately)
- 🟠 No standardised format across inspectors (every inspector had their own template)
- 🟢 SAP integration desired but not blocking

### Product Match
| Need | Scope Capability | Fit | Priority |
|------|-----------------|-----|----------|
| Mobile inspection capture | Mobile app + offline sync | Strong | Delivered (Phase 1) |
| Automated report formatting | Report generation v2 | Strong | Delivered (Phase 1) |
| Defect pattern detection | Anomaly detection | Strong | Delivered (Phase 1) |
| Regulatory compliance view | Compliance dashboard | Strong | Phase 2 (in progress) |
| SAP asset integration | Custom data connector | Partial | Phase 3 |
| Cross-site benchmarking | Multi-site analytics | Gap (roadmap) | Phase 3 |

**Wedge use case:** Mobile inspection capture with auto-formatted reports. Solved the 24-hour reporting lag on day one.

## Deployment Plan

### Method: Phased rollout by user group
**Rationale:** Large enterprise, multiple user types with different needs. Supervisors adopted fastest (anomaly detection), which created pull from inspectors.

### Phase 1 — Foundation (Weeks 1-4) ✅ COMPLETE
- Data ingestion: 3 inspection template types normalised
- Mobile app deployed to 15 inspectors (pilot within pilot)
- Report generation v1 live
- Result: 24-hour reporting lag eliminated for pilot group

### Phase 2 — Core Value (Weeks 5-8) — IN PROGRESS
- Anomaly detection configured for construction defect categories
- Report generation v2 (auto-formatting to BV brand standards)
- Compliance dashboard (real-time regulatory view)
- Expanded from 15 to 45 inspectors

### Phase 3 — Expansion (Weeks 9-12+) — PLANNED
- SAP integration (asset management connection)
- Multi-site rollout tooling
- Cross-project benchmarking
- Target: UK construction division fully deployed

### Risk Register
| Risk | Likelihood | Impact | Mitigation | Status |
|------|-----------|--------|-----------|--------|
| Inspector adoption resistance | Medium | High | Mobile-first UI, supervisor champions, not mandated top-down | Mitigated — 84% adoption |
| SAP integration complexity | High | Medium | Deferred to Phase 3, scoped as standalone workstream | Monitoring |
| Data format inconsistency | Medium | Medium | Template normalisation in Phase 1 | Resolved |
| Champion dependency (Claire) | Low | High | Building relationships with 2 supervisors as secondary champions | Active |

## Issue Log

### ISSUE-001 | Data format inconsistency across inspection templates
- **Status:** Resolved
- **Logged:** 2025-12-10
- **Source:** DS observation during data ingestion sprint
- **Category:** Integration failure
- **Severity:** 🟠 Degrading
- **Affected users:** Field inspectors, compliance leads
- **Description:** Three different inspection template formats across the pilot group. Headers inconsistent, field names varied, date formats mixed (DD/MM vs MM/DD). Data normalisation engine couldn't auto-map without manual rules.
- **Resolution date:** 2025-12-18
- **Cross-client scan:** No precedent at time (first deployment)
- **Root cause:** Each supervisor had created their own template over years. No central standard existed
- **Resolution:** Built a template normalisation layer: mapped all 3 variants to a canonical schema. Created a "template intake" step in the onboarding process so future inspectors submit their existing templates and the system maps them automatically
- **Prevention:** Added "template audit" to the standard onboarding checklist for all new clients
- **Playbook update:** Yes — contributed "Template normalisation" pattern

### ISSUE-002 | Field inspectors not uploading photos same-day
- **Status:** Resolved
- **Logged:** 2026-01-05
- **Source:** Usage data — photo uploads clustering at 6-8pm instead of real-time
- **Category:** Adoption blocker
- **Severity:** 🟠 Degrading
- **Affected users:** Field inspectors
- **Description:** Inspectors were capturing photos during inspections but waiting until end of day to upload. This recreated the old reporting lag pattern, just in a different form.
- **Resolution date:** 2026-01-12
- **Cross-client scan:** No precedent at time
- **Root cause:** Mobile UI required 4 taps to attach a photo to a specific inspection point. Inspectors found it faster to batch-upload later. The friction was UI, not behaviour
- **Resolution:** Worked with product team to add "quick capture" mode: one tap to photo, auto-attached to current inspection point. Photo-to-note lag dropped from hours to seconds
- **Prevention:** Added to playbook: "Mobile UI friction is the #1 adoption blocker for field inspectors. Test upload flow with real inspectors before deployment, not after"
- **Playbook update:** Yes — contributed "Mobile UI friction" pattern

### ISSUE-003 | Legacy CMMS integration request
- **Status:** Open
- **Logged:** 2026-02-15
- **Source:** Email from Claire Dupont
- **Category:** Feature gap
- **Severity:** 🟢 Minor (not blocking current deployment, requested for Phase 3)
- **Affected users:** Compliance leads, supervisors
- **Description:** BV wants inspection data to flow back into their legacy CMMS (Computerised Maintenance Management System) for asset lifecycle tracking. Currently, inspection data and maintenance data live in separate systems. Not blocking current work but needed for Phase 3 expansion case.
- **Resolution:** Pending — scoped for Phase 3 workstream

## Interaction History
| Date | Source | Summary |
|------|--------|---------|
| 2025-11-15 | BD referral | Client file created. Inbound from TIC Council conference. Claire Dupont expressed interest in AI inspection automation for UK construction |
| 2025-11-20 | Client_Intel | Intelligence profile completed. Largest TIC company globally. UK construction division is the entry point |
| 2025-11-25 | Constraint_Map | Constraint mapping complete. Wedge: mobile capture + auto-reports. 3 user types identified |
| 2025-11-27 | Deploy_Plan | Deployment plan created. Method: phased by user group. Phase 1: 4 weeks, 15 inspectors |
| 2025-11-28 | Call | Contract signed. £250k annual, 18 months. Claire confirmed as exec sponsor |
| 2025-12-10 | Log_Issue | ISSUE-001 logged: data format inconsistency. Severity: degrading |
| 2025-12-18 | Resolve | ISSUE-001 resolved. Template normalisation layer built. Playbook updated |
| 2026-01-05 | Log_Issue | ISSUE-002 logged: photo upload delay. Severity: degrading |
| 2026-01-12 | Resolve | ISSUE-002 resolved. Quick capture mode shipped. Playbook updated |
| 2026-01-20 | Milestone | Phase 1 complete. 15 inspectors live. 24-hour reporting lag eliminated |
| 2026-02-01 | Milestone | Phase 2 started. Expanded to 45 inspectors. Anomaly detection live |
| 2026-02-15 | Log_Issue | ISSUE-003 logged: CMMS integration request. Severity: minor. Scoped for Phase 3 |
| 2026-02-20 | Status review | 84% adoption, 37% report turnaround improvement. On track for 90% target |

## Stakeholder Map
| Name | Role | Priority | Communication Style | Trust Level | Notes |
|------|------|----------|-------------------|-------------|-------|
| Claire Dupont | VP Digital Transformation | Primary — exec sponsor | Direct, data-driven, wants dashboard metrics not stories | High | Signed off on expansion budget. Asks "what's the number?" not "how does it feel?" |
| Mark Thompson | Operations Manager, UK Construction | Secondary — day-to-day | Pragmatic, wants proof from his team, skeptical of tech promises | Medium-High | Initially skeptical. Converted after seeing photo upload speed change. Now an internal advocate |
| Sarah Chen | Lead Supervisor | Champion | Detail-oriented, sends feedback proactively, tests edge cases | High | Best source of ground truth. Flags problems before they become issues |

## Playbook Contributions
- 2025-12-18 | "Template normalisation" pattern added to deployment_playbook.md. Confidence: Medium (single instance). Updated to High after TÜV SÜD confirmation
- 2026-01-12 | "Mobile UI friction" pattern added to resolution_patterns.md. Confidence: Medium (single instance)
- 2026-01-20 | "Phased rollout by user group" method validated. Success rate updated in deployment_playbook.md
