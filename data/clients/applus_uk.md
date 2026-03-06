# Applus+ UK

> **INTERVIEW DAY DATA** — This client file was created during a Scope AI deployment strategist interview day (2026-03-06). Information sourced from pre-recorded interviews with Scott Lindsay and Jon Webster, plus publicly available company information. All deployment plans, pricing, and strategic analysis are exercise outputs.

## Profile
- **Company:** Applus+ UK Limited
- **Sector:** Testing, Inspection, Certification (TIC)
- **Parent:** Applus+ Group (global TIC, HQ Barcelona, ~25,000 employees worldwide)
- **UK HQ:** Unit 2, Blocks C & D, West Mains Industrial Estate, Falkirk, FK3 8YE
- **Inspection types:** NDT (UT, MPI, DPT, PAUT, TOFD), storage tank inspection, piping inspection, pressure vessel inspection
- **Industries served:** Oil & gas, petrochemicals, power generation, refining
- **Key client (known):** INEOS Grangemouth
- **Date created:** 2026-03-06
- **Source:** Interview day exercise — Scope AI deployment strategist role

## Key Contacts

| Name | Role | Notes |
|------|------|-------|
| **Scott Lindsay** | Senior Inspector / Team Lead (NDT, storage tanks & piping) | 14-15 years at Applus. Pragmatic, not tech-excited. "As long as it works and doesn't add more clicks, I'm fine." Splits time field (2-3 days/week) and office. Primary user persona |
| **Jon Webster** | Head of Operations (all 5 sites) | Obsessed with throughput vs headcount. Very protective of client relationships. Insists reports must match existing format closely. "If the client hates the new format, it's a non-starter" |

## Sites & Volumes

| Site | Reports/Year | Inspectors | Notes |
|------|-------------|------------|-------|
| Grangemouth | 19,580 | 14 | INEOS site. UT trial already run here. Scope's entry point |
| Falkirk | 13,220 | 33 | Most digital-ready site |
| Yarmouth | 11,120 | 28 | Very paper-heavy. Change management needed |
| Clevedon | 9,240 | 25 | "Always out of meeting rooms, supervisors finish reports in the car" |
| Advanced NDT | 20,310 | 20 | Specialist NDT work. Most complex reports |
| **Total** | **73,470** | **120** | |

## Commercial
- **Contract value:** TBD — pricing options to be presented
- **Pricing preference:** Applus wants pay-per-report only. Scope wants hybrid with recurring maintenance revenue
- **Average inspector salary:** £50,000/year
- **Current report time:** ~3 hours per report
- **Target report time with Scope:** ~1 hour per report
- **Time saved per report:** 2 hours
- **Total hours saved/year:** 146,940 hours (2 hrs x 73,470 reports)
- **Value of time saved:** ~£3.67M/year (at £25/hr effective rate)
- **Negotiation lever:** SkillStation integration — Applus very interested but Scope doesn't want to include initially (too much work). Hold as upsell/future value-add
- **Implementation fees:** Ignored for this exercise

## Deployment State
- **Current stage:** Pre-deployment (interview day exercise)
- **Trial history:** Initial UT trial completed at INEOS Grangemouth
- **Features live:** None (trial only)
- **Adoption:** 0% (trial phase)

## Constraint Map

### User Types
| User Type | Count | Current Workflow | Key Pain Points |
|-----------|-------|-----------------|-----------------|
| **Field Inspector** (Scott persona) | ~120 | Paper notebook + pre-printed checklists on site → rewrite notes into Word template → paste photos manually → submit | Double-handling notes (1hr+ rewriting), photo management ("200 photos = someone's afternoon gone"), weather ruins field notes, meaningless photo filenames (IMG_XXXX) |
| **Supervisor** | ~15-20 (est.) | Chase inspectors for clarifications, fix metadata/layout issues, review reports before client delivery | Spend day fixing other people's formatting. Chase "what did this note mean?" |
| **Operations (Jon)** | 1 (per 5 sites) | Manage throughput vs headcount, handle workload spikes (5-40 reports/day depending on shutdowns) | Can't resource perfectly for spikes. Needs consistency without burning people out |
| **End clients** (INEOS etc.) | Multiple | Receive Applus reports, parse them into their own internal systems | Systems parse specific sections/formatting of Applus reports. Format changes break their integrations |

### Current Tools
- Paper notebooks + pre-printed checklists (field)
- Company phone for photos (shared folder upload)
- Word templates (office, report writing)
- Slow VPN for file uploads
- No standardised naming convention for photos

### Friction Points
1. **Double handling:** Field notes → rewritten report. "I write a bunch of notes in the field and then have to rewrite it all" — Scott
2. **Photo management:** Finding right photo, resizing, matching to correct section. "Pasting photos in is really annoying — can take hours" — Scott
3. **Weather:** Bad weather = minimal field notes = longer reconstruction later
4. **Format consistency:** Reports must look the same across inspectors. Critical for client relationships
5. **Client format sensitivity:** Clients have internal systems parsing Applus reports. Format changes break those systems. "It's not just our workflow. They have auditors too" — Jon
6. **Workload spikes:** Shutdown periods = 30-40 reports/day vs normal 5. Can't resource perfectly
7. **Site variation:** Falkirk (digital) vs Yarmouth (paper-heavy) = different change management needs
8. **Infrastructure:** Slow VPN, bad hotel WiFi during shutdowns, no meeting rooms at Clevedon

### Product Fit Assessment
| Scope Capability | Fit for Applus | Notes |
|-----------------|---------------|-------|
| Mobile inspection capture | HIGH | Eliminates double-handling. Offline sync critical for field work |
| Auto report generation | HIGH | Kills 60-90 min formatting time per report. Scott's #1 value |
| Photo auto-attachment | HIGH | Solves "200 photos = afternoon gone" problem |
| Format matching | CRITICAL | Must replicate L5-NDT-UTT-F01 Rev 1 format exactly. Jon's #1 requirement |
| Data normalisation | MEDIUM | Useful for cross-inspector consistency |
| Compliance checking | MEDIUM | Relevant for regulatory reports |
| Anomaly detection | MEDIUM-HIGH | Corrosion rate trending is core to UT tank inspection |
| Dashboards | MEDIUM | Useful for Jon's throughput monitoring |

## Deployment Plan (Proposed)

### Strategy: Phased Rollout — Client-Safe
Jon's #1 concern is client relationships. Every phase includes a client validation step before scaling.

| Phase | Timeline | Sites | Inspectors | Scope | Success Gate |
|-------|----------|-------|------------|-------|-------------|
| **1: Pilot** | Month 1-2 | Grangemouth | 14 | UT thickness reports only. Match existing L5-NDT-UTT-F01 format exactly | Side-by-side format validation with INEOS. Inspector feedback positive. <30 min report time |
| **2: Expand** | Month 3-4 | + Falkirk | +33 (47 total) | Broader report types. Falkirk chosen as most digital-ready | Falkirk inspectors onboarded. No client format complaints |
| **3: Scale** | Month 5-8 | + Yarmouth + Clevedon | +53 (100 total) | Paper-heavy sites. More change management. Offline-first approach | Yarmouth transitioned from paper. Clevedon supervisors no longer doing reports in cars |
| **4: Full** | Month 9-12 | + Advanced NDT | +20 (120 total) | Most complex report types. Specialist NDT workflows | All 5 sites live. Full report type coverage |

### Key Deployment Principles
1. **Client-first format validation** — Before any site goes live, send side-by-side old vs new reports to key end clients for sign-off. Jon's non-negotiable
2. **Inspector-led adoption** — Scott's persona: "don't add more clicks". Demo must show genuine time savings, not just different workflow
3. **Site-appropriate change management** — Falkirk (digital) gets lighter touch. Yarmouth (paper) needs hands-on training
4. **Workload spike planning** — Don't launch at a site during shutdown season. Launch during normal volume, so inspectors learn before crunch
5. **Offline-first for field** — Mobile capture must work without connectivity. Sync when back on WiFi/network

### Risk Flags
| Risk | Severity | Mitigation |
|------|----------|------------|
| Client rejects new report format | HIGH | Side-by-side validation at every phase. Jon involved in format approval |
| Inspectors resist adoption ("more clicks") | MEDIUM | Demo genuine time savings. Get Scott as champion — if he buys in, others follow |
| Yarmouth paper-to-digital transition too jarring | MEDIUM | Extended training period. Buddy system with Falkirk digital-native inspectors |
| Shutdown workload spikes during rollout | MEDIUM | Phase launches outside shutdown windows. Fallback to existing process during transition |
| Hotel WiFi/VPN too slow for photo sync | LOW | Offline-first mobile design. Batch sync when on good connection |

## Pricing Analysis

### Value Created
- **73,470 reports/year** across all sites
- **2 hours saved per report** (3hrs → 1hr)
- **146,940 hours saved/year**
- **£3.67M annual value** to Applus (at £25/hr effective inspector rate)

### Option A: Per-Report Model (Applus Preference)
| Component | Price | Annual Revenue |
|-----------|-------|---------------|
| Per report fee | £8-12 per report | £587k-£882k/year |
| Platform access | Included | — |
| **Total** | | **£587k-£882k/year** |

- **Pros:** Simple. Aligns with Applus preference. Easy to approve internally
- **Cons:** No revenue floor for Scope. Revenue fluctuates with report volume. No guaranteed recurring base
- **Applus value capture:** 16-24% of value created

### Option B: Hybrid Model (Scope Preference)
| Component | Price | Annual Revenue |
|-----------|-------|---------------|
| Platform fee (per site/month) | £3,000/site/month | £180k/year (5 sites) |
| Per report fee (lower) | £5-7 per report | £367k-£514k/year |
| **Total** | | **£547k-£694k/year** |

- **Pros:** £180k/year guaranteed recurring floor. Predictable for Scope. Still competitive total cost
- **Cons:** Applus may push back on fixed monthly fee. Needs justification (platform maintenance, updates, support)
- **Applus value capture:** 15-19% of value created

### Negotiation Notes
- Both options represent 15-24% of the £3.67M value created — well within typical SaaS value capture range
- **SkillStation integration** is the ace card. Applus wants it. Scope holds it back. Use as: "We can explore SkillStation integration as part of a longer-term partnership" — pushes toward hybrid/commitment
- **Phased pricing** possible: Pilot at Grangemouth on per-report, then move to hybrid as more sites come online
- Don't lead with the most expensive option. Present both, let them discuss, steer toward hybrid

## Issue Log
_No issues logged — pre-deployment_

## Interaction History

### 2026-03-06 — Interview Day Setup
**Type:** Internal (interview exercise)
**Context:** Deployment strategist interview day at Scope AI. Pre-recorded interviews with Scott Lindsay and Jon Webster provided as context. Example UT report from Scott (tank T-204 at INEOS Grangemouth) provided. Task: build demo, deployment plan, pricing, and present to SLT by 4pm.
**Key decisions:** Demo will be built directly in Scope's platform (not DS-OS). Focus on Scott's UT thickness testing workflow as the "magical" use case.

## Scott's Example Report — Reference

### Report Details
- **Template:** L5-NDT-UTT-F01 Rev 1 (Ultrasonic Thickness Testing Inspection Report Form)
- **Report Number:** 0143
- **Equipment:** Storage Tank T-204
- **Client:** INEOS Grangemouth
- **PO:** PO-4852
- **Date of Inspection:** 07/12/2025
- **Job Description:** External and internal inspection with UT thickness readings of the floor plates

### Report Structure (3 pages)
1. **Page 1 — Header + Findings**
   - Header block: Report number, tank ID (T-204), date, client (INEOS Grangemouth), PO number, job description
   - Findings: Free-text narrative describing external visual exam, internal visual exam, UT thickness measurements, MPI on nozzle/manway welds, overall condition assessment
   - Footer: Document ref (L5-NDT-UTT-F01 Rev 1), "Uncontrolled if printed", Applus address

2. **Page 2 — Photographs (set 1)**
   - Photo grid with description labels
   - Photos: Tank plate, Outside of tank

3. **Page 3 — Photographs (set 2)**
   - Photo grid with description labels
   - Photos: Stairs, Valves

### Key Findings from Report
- External: coating breakdown on lower shell courses (6 o'clock, 9 o'clock), surface corrosion, local pitting
- Shell to bottom weld: light staining, minor undercut, no active leakage
- Settlement: max differential 8mm (within tolerance, trending upward at one datum)
- Internal: isolated pitting on floor plates within 500mm of shell, worst near product inlet
- UT readings: local wall loss up to 30% (min 6.3mm vs nominal 9.5mm plate)
- Pit depths up to 2.0mm, tight density not widespread
- Shell courses above minimum thickness, but emerging thinning pattern on first course weld seam
- MPI on nozzle/manway welds: no reportable indications
- **Overall:** Fit for continued service short-to-medium term, subject to local floor repairs and corrosion trend monitoring

## Playbook Contributions
_None yet — pre-deployment_
