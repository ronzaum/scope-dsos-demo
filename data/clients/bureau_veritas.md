# Bureau Veritas

> **SIMULATED DATA** — This client file contains fabricated demo data. It was not provided by Scope AI or sourced from actual client engagements. Company details are based on publicly available information; all deployment data, commercial terms, issues, interactions, and stakeholder details are fictional and created for demonstration purposes only.

## Profile
- **Sector:** Testing, Inspection, Certification (TIC). Global leader
- **Size:** 83,000+ employees, ~12,000 inspectors across 140 countries, 1,600 offices
- **Inspection types:** Construction & infrastructure, marine & offshore, power & utilities, oil & gas, food safety, consumer products
- **Geography:** Global HQ in Paris. UK operations significant. Pilot focused on UK construction inspections
- **Source:** Inbound via BD. Initial contact through industry event (TIC Council conference)
- **Initial contact:** Claire Dupont, VP Digital Transformation
- **Date created:** 2025-11-15

## Pipeline Inspection Intelligence (API 570 Expansion)

> Added 2026-03-04 via `/Client_Intel` — Pipeline inspection expansion research

**Division:** Bureau Veritas Oil & Gas — Integrity Management Services
**Key sites (UK):** Grangemouth Processing Complex (Scotland), Fawley Refinery (Hampshire), Lindsey Oil Refinery (Lincolnshire)
**Pipeline scope:** ~3,200 km of in-service process piping across 3 UK petrochemical sites. Mix of carbon steel (70%), low-alloy steel (20%), stainless/duplex (10%)
**Current inspection regime:** API 570 / API 574 risk-based inspection. ~450 Condition Monitoring Locations (CMLs) per site, 5-year rotation cycle
**Inspection volume:** ~2,400 pipeline inspections/year across the 3 sites. Peak during turnaround seasons (Q2, Q4)
**Key personnel (pipeline division):**
- **Richard Oakley** — Head of Pipeline Integrity, UK Downstream. 20+ years. Decision-maker for pipeline tooling
- **Emma Walsh** — Senior Integrity Engineer, Grangemouth. Technical lead. Evaluates new tools
- **Team:** 28 pipeline inspectors (UK), 6 integrity engineers, 2 corrosion engineers

**Current tools (pipeline):** Manual UT (Olympus 38DL Plus fleet), spreadsheet CML tracking (Excel), SAP PM for asset register, paper-based P&ID markup for inspection planning
**Pain points (pipeline-specific):**
- CML data lives in Excel — no automated corrosion rate trending
- Report turnaround: 5-7 business days per pipeline circuit (inspector → supervisor → compliance)
- No automated remaining life calculation — done manually per CML, error-prone
- CUI (Corrosion Under Insulation) assessments are paper-based, no photo-to-location linking
- Injection point tracking is a separate spreadsheet with no connection to CML data

**Competitive context:** BV is evaluating Scope against their in-house "BV Integrate" platform, which handles asset management but has no inspection-specific AI layer. Scope's advantage: purpose-built for inspection reports, auto-calculation, anomaly detection

**Strategic fit:** Pipeline expansion validates Scope's multi-inspection-type capability on a single client. Success here proves the platform can scale horizontally (new inspection types) not just vertically (more users on same type). This is the key proof point for the Series A pitch

## Commercial
- **Pipeline stage:** Active
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
- **Adoption by type:**
  - Construction defect reports: 91% (38/42 users)
  - Anomaly detection: 76% (34/45 users)
  - Data normalisation: 88% (40/45 users)

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

### Pipeline Inspection Constraint Map (API 570 Expansion)

> Added 2026-03-04 via `/Constraint_Map`

#### User Map (Pipeline Division)
| User Type | Count | Daily Reality | Language | Top Pain Point | Adoption Signal |
|-----------|-------|---------------|----------|----------------|-----------------|
| Pipeline Inspector | 28 | On-site 6-10 hours. Takes UT readings at CMLs, photographs CUI areas, marks up P&IDs. Returns to office to enter data into Excel and draft report | "Give me one place to enter readings and let it calculate everything" | Manual CML data entry into spreadsheets. Corrosion rate calculations done by hand — error-prone, takes 45 min per circuit | High — already frustrated with Excel. Construction team's adoption is visible proof |
| Integrity Engineer | 6 | Reviews inspection data, runs fitness-for-service assessments, sets inspection intervals. Manages the RBI programme | "I need trending data across all CMLs instantly, not a 3-day turnaround to get the spreadsheet updated" | Corrosion rate trending requires pulling data from 6+ Excel files per circuit. No automated remaining life calculation | High — this is the core value they want. Auto-trending is the hook |
| Corrosion Engineer | 2 | Root cause analysis, material selection, inhibitor programme management. Needs historical data across all sites | "I want to see every CML that's thinning faster than predicted in one view" | Cross-site corrosion pattern analysis is manual. No anomaly detection across CMLs | Medium — smaller team, but high influence on tool selection |
| Site Compliance Manager | 3 | Ensures inspection schedules meet API 570 / PSSR requirements. Reports to HSE and internal audit | "I need to know we haven't missed an inspection and that the next exam dates are right" | Tracking 450+ CMLs per site for inspection compliance. Manual interval calculations | High — compliance dashboard solves their biggest risk |

#### Solutions Audit (Pipeline)
**Current tools:** Manual UT (Olympus fleet), Excel CML trackers (per-inspector, not centralised), SAP PM (asset register only), paper P&ID markups, email for report routing
**Process flow:** Inspector takes readings → enters into personal Excel → emails to integrity engineer → engineer calculates rates → drafts report → supervisor reviews → compliance signs off → filed in SAP
**Friction points:**
- 🔴 No single source of truth for CML data — each inspector has their own spreadsheet
- 🔴 Corrosion rate calculations done manually — 3 errors found per 100 calculations in last audit
- 🟠 Report turnaround: 5-7 days from inspection to signed report
- 🟠 CUI assessments not linked to CML data — separate workflow, separate documentation
- 🟠 Injection point inspections tracked in yet another spreadsheet
- 🟢 SAP integration desired for automated work order creation but not blocking

**Past attempts:** BV Integrate platform evaluated (2024) — rejected by pipeline team as "too generic, doesn't understand inspection data"

#### Product Match (Pipeline)
| Need | Scope Capability | Fit | Priority |
|------|-----------------|-----|----------|
| Centralised CML data capture | Mobile app + CML data model | Strong | Phase 1 |
| Auto corrosion rate calculation | Auto-calculate (ST rate, LT rate, remaining life) | Strong | Phase 1 |
| RAG status classification | Auto-classify remaining life (green/amber/red/critical) | Strong | Phase 1 |
| Anomaly detection on CML trends | Rate acceleration detection, calibration flags | Strong | Phase 1 |
| Automated report generation (API 570) | Report generator with pipeline template | Strong | Phase 1 |
| CUI assessment integration | Photo-to-location linking + structured CUI fields | Partial | Phase 2 |
| Injection point tracking | Custom field set within pipeline template | Strong | Phase 1 |
| Cross-site trending | Multi-site analytics (same as construction roadmap) | Gap (roadmap) | Phase 3 |
| SAP work order integration | Custom data connector | Partial | Phase 3 |

**Wedge use case (pipeline):** Auto-calculated corrosion rates + remaining life from CML readings. Eliminates manual calculation errors and reduces report turnaround from 5-7 days to same-day.

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

### Pipeline Deployment Plan (API 570 Expansion)

> Added 2026-03-04 via `/Deploy_Plan` — Builds on construction deployment infrastructure

**Method:** Hybrid — on-site embedding at Grangemouth (lead site) + remote support for Fawley and Lindsey
**Rationale:** Leverages existing BV relationship + construction deployment infrastructure. Grangemouth has the most complex piping (amine service, high-temp) and the strongest champion (Emma Walsh). Success at Grangemouth creates pull for the other two sites.

**Playbook precedent:** Construction deployment pattern (phased by user group) applied successfully. Pipeline adds a new axis: phased by inspection type within a single client. This is a first — compounds the playbook.

#### Phase 1 — Pipeline Foundation (Weeks 1-3)
- Pipeline template spec (API 570) built and QA'd
- CML data model configured (450 CMLs at Grangemouth imported from Excel)
- Auto-calculation engine verified: corrosion rates, remaining life, RAG status
- 8 pipeline inspectors at Grangemouth onboarded (subset of 28)
- Report generation live for pipeline circuits
- **Success criteria:** First 10 pipeline inspection reports generated via Scope. Zero manual corrosion rate calculations needed
- **Risk:** CML data import from Excel — data quality varies per inspector's spreadsheet

#### Phase 2 — Pipeline Core Value (Weeks 4-6)
- Anomaly detection configured for pipeline-specific patterns (CUI, injection point corrosion, accelerating rates)
- CUI assessment fields integrated into pipeline template
- Injection point tracking fields added
- Remaining 20 pipeline inspectors at Grangemouth onboarded
- Integrity engineers granted dashboard access for trending
- **Success criteria:** 90%+ of Grangemouth pipeline inspections flowing through Scope. Integrity engineers using trending daily
- **Risk:** Integrity engineers may want to customise trending views beyond current dashboard capability

#### Phase 3 — Multi-Site Pipeline Rollout (Weeks 7-10)
- Fawley site CML data imported and configured
- Lindsey site CML data imported and configured
- Remote onboarding for Fawley (12 inspectors) and Lindsey (8 inspectors)
- Cross-site trending dashboard (if available on roadmap)
- Corrosion engineers granted access for cross-site analysis
- **Success criteria:** All 3 UK petrochemical sites live. Report turnaround <1 day across all sites
- **Risk:** Cross-site trending may not be available — mitigate with per-site dashboards and manual export

#### Pipeline Risk Register
| Risk | Likelihood | Impact | Mitigation | Status |
|------|-----------|--------|-----------|--------|
| CML data quality from Excel import | High | Medium | Build data validation + cleanup tool during import. Flag anomalies (missing readings, impossible values) | Active |
| Integrity engineer resistance to new workflow | Medium | High | Emma Walsh as champion. Show trending value in week 1. Let them keep Excel as backup initially | Active |
| CUI assessment workflow doesn't match current practice | Medium | Medium | Shadow 2 CUI inspections at Grangemouth before configuring fields. Adapt to their workflow, not vice versa | Active |
| Cross-site trending not on product roadmap in time | Medium | Low | Per-site dashboards + CSV export covers 80% of need. Flag to product team as pipeline expansion requirement | Monitoring |
| Turnaround season overlap (Q2) | Low | High | Front-load onboarding to weeks 1-3 before April turnaround season. Inspectors too busy during turnarounds | Active |

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
| 2026-03-04 | Start | Pipeline inspection expansion request. BV's petrochemical refinery division (Grangemouth, Fawley, Lindsey) wants AI-powered pipeline inspection per API 570. Scope: new inspection type on existing deployment infrastructure. Triggered by Claire Dupont after internal presentation of construction inspection results |
| 2026-03-04 | Client_Intel | Pipeline intelligence complete. BV Oil & Gas division: 3,200 km piping across 3 UK sites, 28 inspectors, 2,400 inspections/year. Richard Oakley (Head of Pipeline Integrity) is decision-maker. Key pain: manual CML tracking in Excel, 5-7 day report turnaround, no automated corrosion trending |
| 2026-03-04 | Constraint_Map | Pipeline constraint map complete. 4 user types (28 inspectors, 6 integrity engineers, 2 corrosion engineers, 3 compliance managers). Wedge: auto-calculated corrosion rates from CML readings. Product fit: strong across 7/9 needs. Key gap: cross-site trending (roadmap) |
| 2026-03-04 | Deploy_Plan | Pipeline deployment plan created. Method: hybrid (on-site Grangemouth + remote Fawley/Lindsey). 3 phases over 10 weeks. Phase 1: 8 inspectors at Grangemouth, template + CML import + auto-calc. Phase 2: anomaly detection + 20 more inspectors. Phase 3: multi-site rollout |

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
