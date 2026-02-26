# TÜV SÜD

## Profile
- **Sector:** Testing, Inspection, Certification (TIC). German market leader, global top 5
- **Size:** 26,000+ employees, ~5,000 inspectors, operations in 50+ countries
- **Inspection types:** Automotive (primary), industrial machinery, elevators & escalators, energy systems, rail
- **Geography:** HQ in Munich. UK operations in Birmingham and London. Pilot focused on UK automotive inspections
- **Source:** Inbound — referral from industry contact who knew about Scope's TIC focus
- **Initial contact:** Dr. Andreas Keller, Head of Digital Solutions, UK Automotive Division
- **Date created:** 2025-09-10

## Commercial
- **Contract status:** Active — at risk
- **Contract value:** £150,000 annual
- **Term:** 12 months (started 2025-09-25)
- **Months in:** 5
- **Renewal date:** 2026-09-25
- **Economic buyer:** Dr. Andreas Keller, Head of Digital Solutions
- **Success criteria:** 50% reduction in inspection documentation time; 85% inspector adoption within 4 months
- **Expansion potential:** £400k if expanded to industrial machinery + elevator divisions. Currently frozen pending adoption recovery

## Deployment State
- **Stage:** Active Deployment — STALLED
- **Phase:** Phase 1 — adoption below threshold
- **Features live:** Report generation (configured for automotive inspection standards), anomaly detection (configured but underused)
- **Features configured but not adopted:** Anomaly detection (inspectors not using alerts), compliance dashboard (compliance team hasn't logged in since week 2)
- **Features planned (Phase 2):** On hold pending adoption recovery
- **Users:** 20 inspectors (only 8 active daily — 40% adoption), 4 supervisors (2 active), 2 compliance leads (0 active)
- **Adoption:** 40% daily active. Target was 85% by month 4. MISSED
- **Baseline improvement:** 18% reduction in documentation time (target: 50%). Significantly below target

## Constraint Map

### User Map
| User Type | Count | Daily Reality | Language | Top Pain Point | Adoption Signal |
|-----------|-------|---------------|----------|----------------|-----------------|
| Automotive Inspector | 20 | On-site at manufacturing plants and dealerships, 4-6 inspections/day, strict protocol adherence required | "Wir brauchen das auf Deutsch" (we need it in German) — many inspectors are German-speaking | Inspection protocols are highly standardised (ISO/TS 16949) — any tool must match exactly or it slows them down | 40% active. Reverted inspectors say "my clipboard is faster" |
| Supervisor | 4 | Reviews inspection batches, signs off on compliance, reports to division head | "Show me the numbers are right before I sign" | Personal liability for sign-off accuracy. Will not adopt if they can't verify data integrity | 50% active. 2 supervisors trust the system, 2 don't |
| Compliance Lead | 2 | Regulatory reporting to KBA (German automotive authority), audit management | "We can't afford a missed filing" | Regulatory deadlines are fixed. Any tool that adds uncertainty is worse than manual | 0% active. Logged in once in week 1, never returned |

### Solutions Audit
**Previous tools:** Paper inspection forms (ISO-formatted), Excel trackers (per supervisor), custom internal database (read-only archive), SAP for parts tracking
**Friction points:**
- 🔴 Inspectors reverting to paper — faster than current digital workflow for standardised checks
- 🔴 Compliance team not engaged — tool doesn't match their regulatory reporting format
- 🟠 German language interface incomplete — some UI elements and error messages still in English
- 🟠 Anomaly detection alerts feel generic — not tuned to automotive-specific defect patterns
- 🟢 Integration with internal archive desired but not blocking

### Product Match
| Need | Scope Capability | Fit | Priority |
|------|-----------------|-----|----------|
| Standardised inspection protocols (ISO) | Configurable inspection templates | Strong (if configured correctly) | Critical — currently misconfigured |
| German language full support | Localisation | Partial — incomplete | High — adoption blocker |
| Automotive defect pattern detection | Anomaly detection | Strong (needs tuning) | Medium — not the blocker |
| KBA regulatory report format | Report generation | Gap — custom format needed | High — compliance team blocker |
| Parts tracking integration (SAP) | Custom data connector | Partial | Low — Phase 2 |

**Wedge use case (original):** Standardised inspection capture replacing paper forms. FAILED — paper is still faster because inspection template configuration doesn't match the inspectors' existing protocol flow.

**Revised wedge (recommended):** Fix template configuration to mirror exact ISO protocol sequence. Then German language completion. Then compliance reporting format. Adoption will follow when the tool is faster than paper for their specific workflow.

## Deployment Plan

### Method: Remote setup (original decision)
**Rationale at time:** Mid-size pilot, clear use case, assumed inspectors would adopt digital over paper quickly
**Retrospective:** Wrong method for this client. Automotive inspectors have extremely standardised workflows and high protocol adherence. Remote configuration missed nuances that on-site observation would have caught. Should have been hybrid or on-site embedding

### Phase 1 — Foundation (Weeks 1-4) — PARTIALLY COMPLETE
- Data ingestion: automotive inspection templates configured ⚠️ Configuration doesn't match inspector workflow
- Report generation: live but format doesn't match KBA requirements
- Deployed to all 20 inspectors simultaneously (too fast — should have piloted with 5)
- Result: Initial adoption 65% in week 1, declined to 40% by month 2

### Phase 2 — Core Value — ON HOLD
- Anomaly detection tuning for automotive defects — blocked by low adoption
- Compliance dashboard — blocked by compliance team non-engagement
- Expansion to industrial machinery division — frozen

### Risk Register
| Risk | Likelihood | Impact | Mitigation | Status |
|------|-----------|--------|-----------|--------|
| Full adoption failure | HIGH | HIGH | Adoption recovery plan needed. See ISSUE-001 | ACTIVE — CRITICAL |
| Contract non-renewal | Medium | HIGH | Depends on adoption recovery in next 3 months | Monitoring |
| Champion burnout (Andreas) | Medium | Medium | Andreas has been escalating internally. Need to show progress to protect him | Active |
| German language gaps | HIGH | Medium | Localisation sprint planned | Not started |
| Compliance team permanent disengagement | Medium | HIGH | Need KBA report format. Without compliance buy-in, renewal is at risk | Active |

## Issue Log

### ISSUE-001 | Adoption stalled — inspectors reverting to manual process
- **Status:** Open — CRITICAL
- **Logged:** 2026-01-15
- **Source:** Usage data + call with Andreas Keller
- **Category:** Adoption blocker
- **Severity:** 🔴 Blocking
- **Affected users:** Field inspectors (primary), supervisors (secondary), compliance leads (not engaged)
- **Description:** Inspector adoption peaked at 65% in week 1 and has declined to 40% by month 2. Inspectors report that the digital inspection flow is slower than their paper clipboard for standardised automotive checks. The template configuration doesn't match the exact sequence of their ISO protocol. They have to navigate extra screens to complete checks that take one page on paper. Additionally, some UI elements are in English, which creates friction for German-speaking inspectors. Two supervisors stopped using the system because they couldn't verify the data matched the original protocol format. Compliance leads never engaged because the output reports don't match KBA regulatory format.
- **Root cause analysis (preliminary):**
  1. Template misconfiguration: the digital inspection flow adds steps that don't exist in the paper protocol and changes the sequence of checks. For inspectors who do this 4-6 times daily on autopilot, any deviation is slower, not faster
  2. Remote deployment missed workflow observation: we configured templates from documentation, not from watching inspectors work. The documentation doesn't capture the shortcuts and sequences inspectors actually use
  3. Full rollout too fast: deploying to all 20 inspectors in week 1 meant no time to iterate on the first 5 users' feedback before scaling
  4. Language gaps: incomplete German localisation signals "this wasn't built for us"
  5. Compliance format gap: no KBA report output means the compliance team has no reason to engage
- **Resolution:** Pending — run /Resolve. Recommended: on-site observation sprint, reconfigure templates, complete localisation, build KBA report format
- **Playbook update needed:** Yes — this is a major learning about remote vs on-site deployment for standardised-workflow clients

### ISSUE-002 | German language localisation incomplete
- **Status:** Resolved
- **Logged:** 2025-10-20
- **Source:** Inspector feedback via supervisor
- **Category:** Integration failure
- **Severity:** 🟠 Degrading
- **Affected users:** All German-speaking users
- **Description:** Error messages, some button labels, and help text still in English. Inspectors flagged this in week 3. Creates perception that the product isn't ready for German market.
- **Resolution date:** 2025-11-15
- **Root cause:** Localisation was 85% complete at deployment. Remaining 15% was in error messages, edge-case UI states, and help documentation
- **Resolution:** Product team completed full German localisation sprint. All user-facing text now in German. Help docs translated
- **Prevention:** Added to onboarding checklist: "Verify 100% localisation BEFORE deployment for non-English markets"
- **Playbook update:** Yes — contributed "Localisation completeness" pattern
- **Note:** While ISSUE-002 (UI text) is resolved, German language remains a factor in ISSUE-001 because the PERCEPTION of "not built for us" persists from the early incomplete experience

## Interaction History
| Date | Source | Summary |
|------|--------|---------|
| 2025-09-10 | Referral | Client file created. Referred by industry contact. Andreas Keller interested in automotive inspection digitisation |
| 2025-09-15 | Client_Intel | Intelligence profile completed. German TIC leader, strong automotive vertical, ISO-driven protocols |
| 2025-09-18 | Constraint_Map | Constraint mapping complete. Wedge: standardised inspection capture replacing paper. 3 user types, heavy ISO protocol adherence |
| 2025-09-22 | Deploy_Plan | Deployment plan created. Method: remote setup. Phase 1: 4 weeks, 20 inspectors |
| 2025-09-25 | Contract | Contract signed. £150k annual, 12 months. Andreas confirmed as sponsor |
| 2025-10-01 | Go-live | Phase 1 launched. All 20 inspectors onboarded. Initial adoption 65% |
| 2025-10-20 | Log_Issue | ISSUE-002 logged: German localisation incomplete. Severity: degrading |
| 2025-11-01 | Status check | Adoption dropped to 55%. Andreas concerned. Flagged template configuration as possible issue |
| 2025-11-15 | Resolve | ISSUE-002 resolved. Full German localisation complete |
| 2025-12-01 | Status check | Adoption dropped to 45%. Inspectors explicitly saying paper is faster. Supervisors split |
| 2026-01-15 | Log_Issue | ISSUE-001 logged: adoption stalled at 40%. Severity: BLOCKING. Comprehensive root cause analysis begun |
| 2026-02-01 | Call | Andreas escalating internally. Needs visible progress within 6 weeks or risks losing budget approval for continuation |
| 2026-02-15 | Internal | Recovery plan drafted: on-site observation sprint + template reconfiguration + KBA report format build. Pending approval and scheduling |

## Stakeholder Map
| Name | Role | Priority | Communication Style | Trust Level | Notes |
|------|------|----------|-------------------|-------------|-------|
| Dr. Andreas Keller | Head of Digital Solutions | Primary — sponsor | Analytical, data-driven, patient but running out of runway internally | Medium — declining | Believed in the product early. Now needs results to justify continued investment. Has been fair but direct: "I need something to show my board" |
| Wolfgang Fischer | Lead Automotive Inspector | Potential champion — not yet | Pragmatic, respected by peers, won't adopt unless it's genuinely faster | Low | Has been vocal about template configuration issues. If we fix his workflow, he becomes the champion. If not, he's the most credible voice against adoption |
| Petra Müller | Compliance Manager | Disengaged | Process-oriented, risk-averse, needs regulatory alignment before engaging | Very Low | Logged in once. Said "come back when it generates KBA reports." Fair point |

## Playbook Contributions
- 2025-11-15 | "Localisation completeness" pattern added to resolution_patterns.md. Confidence: Medium
- 2026-01-15 | ISSUE-001 pending resolution — expected to contribute "Remote deployment limitations for standardised-workflow clients" pattern. Not yet added
