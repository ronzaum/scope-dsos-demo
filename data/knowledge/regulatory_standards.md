# Regulatory Standards — Knowledge Base
# Layer 1: Industry Knowledge
# Last Updated: 2026-03-04

---

## Overview

Eight key standards govern TIC inspection work. Each defines what is inspected, how, and what constitutes pass/fail. Understanding these is critical for template configuration, compliance checking, and report generation.

---

## 1. API 510 — Pressure Vessel Inspection Code

**Full name:** API 510 — Pressure Vessel Inspection Code: In-Service Inspection, Rating, Repair, and Alteration

**Issued by:** American Petroleum Institute (API)

**Governs:** In-service inspection, repair, alteration, and re-rating of pressure vessels. Applies once a vessel is in operation (not original construction — that's ASME). Covers petroleum refining, chemical processing, and related industries.

### Inspection Intervals
- **Internal/on-stream:** Lesser of (a) half the estimated remaining life, or (b) 10 years
- **External:** Maximum 5 years (extendable with RBI per API 580/581)
- **Pressure-relieving devices:** Maximum 5 years (10 years for clean, non-corrosive service)
- **Risk-Based Inspection (RBI):** Explicitly permitted. High-risk vessels inspected more often; low-risk can extend beyond prescriptive maximums

### Classification System
- **Corrosion rate classifications:** Vessels classified by measured rates (short-term and long-term)
- **Remaining life formula:** (t_actual − t_required) ÷ Corrosion Rate
- **Damage mechanisms:** References API 571 — general corrosion, localised corrosion, SCC, hydrogen damage, creep, erosion, etc.
- **Fitness-for-service:** API 579-1/ASME FFS-1 when vessel doesn't meet original design requirements

### Report Requirements
Must include: vessel ID, date, inspection type, NDE methods, thickness readings with locations, corrosion rate calculations, remaining life estimate, defects with descriptions and locations, FFS results (if applicable), recommendations, inspector certification number. All data maintained for life of vessel. Annex C of API 510 provides a sample inspection record format; Annex D provides a sample repair/alteration/rerating form.

> **Verification note (2026-03-04):** Report contents cross-checked against API 510 (2006) and Inspectioneering reference. Confirmed accurate. Note: RAG status thresholds used in template specs (Green >10yr, Amber 5-10yr, Red <5yr, Critical <2yr) are industry-standard practice, not prescribed by API 510 itself.

### Inspector Certification
API 510 Pressure Vessel Inspector — individual credential. Exam covers API 510, ASME VIII Div.1, API 572, API 576, API 571, NBIC. Recertification every 3 years.

### Examples

**Scenario:** During a scheduled internal inspection at a petroleum refinery, an API 510 inspector discovers significant wall thinning on the lower shell course of a carbon steel crude oil storage vessel (V-1042). Ultrasonic thickness measurements show the shell has thinned from the nominal 19.1mm to 12.1mm over 8 years of service, with accelerated localised thinning near the bottom nozzle (9.8mm). The minimum required thickness per ASME VIII Div.1 is 9.5mm. The inspector calculates a general corrosion rate of 0.875 mm/yr and remaining life of 2.97 years for the shell, but only 0.34 years at the localised area. The localised zone is flagged as Critical (remaining life <2yr), requiring immediate fitness-for-service evaluation per API 579-1 before the vessel can return to service. A temporary repair pad is authorised under API 510 Section 8, and the vessel is placed on a 6-month re-inspection interval.

**Report Excerpt:**
```
PRESSURE VESSEL INSPECTION RECORD — API 510
Vessel ID: V-1042 | Tag: Crude Oil Storage Vessel
Location: Unit 3, East Battery | Service: Crude Oil (H2S trace)
Inspection Date: 2026-02-18 | Type: Internal (Scheduled)
Inspector: J. Reeves, API 510 Cert #48271

THICKNESS READINGS (UT — straight beam, 5 MHz):
  TML-01 (Upper shell):   17.4 mm  (nominal 19.1 mm) — Rate: 0.21 mm/yr
  TML-02 (Mid shell):     15.6 mm  (nominal 19.1 mm) — Rate: 0.44 mm/yr
  TML-03 (Lower shell):   12.1 mm  (nominal 19.1 mm) — Rate: 0.875 mm/yr
  TML-04 (Bottom nozzle): 9.8 mm   (nominal 19.1 mm) — Rate: 1.16 mm/yr [CRITICAL]

REMAINING LIFE:
  TML-03: (12.1 - 9.5) / 0.875 = 2.97 years — RED (<5yr)
  TML-04: (9.8 - 9.5) / 1.16  = 0.26 years — CRITICAL (<2yr)

DEFECTS: Localised internal thinning at bottom nozzle (TML-04), suspected
  underdeposit corrosion. No cracking detected (MT scan clean).

RECOMMENDATION: FFS evaluation per API 579-1 Level 2 required for TML-04
  before return to service. Temporary repair pad per API 510 Section 8.
  Re-inspect in 6 months. Full repair at next turnaround.
```

---

## 2. LOLER — Lifting Operations and Lifting Equipment Regulations 1998

**Full name:** The Lifting Operations and Lifting Equipment Regulations 1998 (SI 1998/2307)

**Issued by:** UK HSE, under Health and Safety at Work Act 1974

**Governs:** All lifting equipment and operations in UK workplaces. Cranes, hoists, lifts, forklifts, slings, shackles, eyebolts, patient hoists, tail-lifts — everything used to lift loads, including people.

### Key Regulations
| Reg | Requirement |
|-----|-------------|
| 4 | Strength and stability adequate for each load |
| 5 | Additional safety when lifting persons (fail-safe, anti-crush/fall) |
| 6 | Positioning and installation to reduce risk |
| 7 | SWL clearly marked |
| 8 | Every lift properly planned, supervised, carried out safely |
| **9** | **Thorough examination by competent person** (core inspection requirement) |
| 10 | Results recorded and reported |
| 11 | Records kept and available |

### Examination Intervals
| Equipment Type | Maximum Interval |
|---------------|-----------------|
| Lifting persons | 6 months |
| All other lifting equipment | 12 months |
| Lifting accessories (slings, shackles) | 6 months |
| Before first use (no EC Declaration) | Before use |
| After event affecting safety | Before resumed use |

**Written Scheme of Examination** — Can specify different intervals if drawn up by a competent person.

### Defect Classification
| Classification | Action |
|---------------|--------|
| **Existing or imminent danger** | Notify employer AND enforcing authority (HSE) immediately. Equipment out of service. |
| **Could become a danger** | Report to employer with repair deadline. HSE notified within 28 days. |
| **No defect / minor** | Normal report cycle |

### Report Contents (Regulation 9/Schedule 1)
Schedule 1 prescribes the information a thorough examination report must contain. Key items: employer name/address, premises address, equipment particulars (description, ID, SWL, manufacture date if known), date of last thorough examination, next examination due date, examination date, whether safe to operate, defects identified (with details of any danger or potential danger), required repairs/renewals/alterations, testing particulars, competent person name/qualifications/address, report date, and authenticating signature. No prescribed format — any layout is acceptable provided all items are included.

> **Verification note (2026-03-04):** Schedule 1 contents cross-checked against ALLMI guidance and HSE INDG422. KB summary confirmed accurate.

### Examples

**Scenario:** A competent person conducts a 12-monthly thorough examination on a 20-tonne overhead bridge crane at a steel fabrication workshop. During the inspection, the wire rope shows 6 visible broken wires in one rope lay length on the primary hoist — exceeding the ISO 4309 discard threshold of 5 broken wires for this rope construction (6x36 WS). Additionally, the limit switch on the upper travel fails to activate during functional testing. The competent person classifies the wire rope as "could become a danger" (requiring replacement within 14 days) and the failed limit switch as "existing or imminent danger" (crane taken out of service immediately until repaired). The employer is notified verbally on-site. HSE receives the defect notification within 24 hours for the imminent danger item.

**Report Excerpt:**
```
THOROUGH EXAMINATION REPORT — LOLER 1998, Schedule 1
Employer: Midlands Steel Fabrications Ltd
Premises: Unit 7, Willenhall Industrial Estate, WV13 2QR
Equipment: Overhead Bridge Crane, SWL 20 tonnes
Make/Model: Street ZX20 | Serial: SC-2019-4451 | Year: 2019
Date of Last Examination: 2025-03-10
Date of This Examination: 2026-03-08
Next Examination Due: 2026-09-08

SAFE TO CONTINUE IN USE: NO

DEFECTS IDENTIFIED:
1. Wire rope — primary hoist: 6 broken wires in one lay length
   (discard criteria exceeded per ISO 4309). Classification: COULD
   BECOME A DANGER. Action: Replace rope within 14 days.

2. Upper travel limit switch: failed to activate during functional
   test. Classification: EXISTING OR IMMINENT DANGER. Action: Crane
   immediately taken out of service. HSE notified same day.

Competent Person: A. Patel, CEng MIMechE
Organisation: SafeLift Inspection Services Ltd
Report Date: 2026-03-08 | Signature: [signed]
```

---

## 3. BS 7671 — IET Wiring Regulations

**Full name:** BS 7671: Requirements for Electrical Installations (18th Edition, 2018, amended 2022)

**Issued by:** IET and BSI jointly

**Governs:** Design, erection, and verification of electrical installations in UK buildings. All low-voltage installations up to 1000V AC / 1500V DC — residential, commercial, industrial, agricultural.

### Testing Requirements (Part 6, in prescribed order)
1. Continuity of protective conductors (including main and supplementary bonding)
2. Continuity of ring final circuit conductors
3. Insulation resistance (min 1 MΩ at 500V DC for 230V circuits)
4. Polarity
5. Earth fault loop impedance (Zs — must not exceed max for protective device disconnection time)
6. Prospective fault current (verify protective device breaking capacity adequate)
7. RCD operation (must trip within 40ms at 5x rated residual current for Type AC)
8. Functional testing (switchgear, controls, interlocks)

### Certification Types
| Certificate | When Used |
|------------|-----------|
| **EIC** (Electrical Installation Certificate) | New installation or addition. Issued by designer, constructor, inspector/tester |
| **EICR** (Electrical Installation Condition Report) | Periodic inspection of existing installation. Overall: Satisfactory/Unsatisfactory |
| **Minor Works Certificate** | Small additions/alterations not extending existing circuit |

### Observation Codes (EICR)
| Code | Meaning | Action | Makes "Unsatisfactory" |
|------|---------|--------|----------------------|
| **C1** | Danger present | Immediate remedial action | **Yes** |
| **C2** | Potentially dangerous | Urgent remedial action | **Yes** |
| **C3** | Improvement recommended | Advisory, not dangerous | No |
| **FI** | Further investigation required | Cannot fully assess | No (but needs resolution) |

> **Verification note (2026-03-04):** C1/C2/C3/FI codes cross-checked against IET published model forms (BS 7671:2018+A2:2022) and multiple electrical contractor sources. Definitions and satisfactory/unsatisfactory logic confirmed accurate.

### Recommended Inspection Intervals
| Premises Type | Interval |
|--------------|----------|
| Domestic | 10 years (or change of occupancy) |
| Commercial | 5 years |
| Industrial | 3 years |
| Swimming pools | 1 year |
| Construction sites | 3 months |

### Key Parts
- Part 1-3: Scope, definitions, general characteristics
- **Part 4: Protection for safety** (earthing/bonding, fire protection, overvoltage)
- Part 5: Selection and erection of equipment
- **Part 6: Inspection and testing**
- Part 7: Special installations (bathrooms, pools, construction sites, solar PV, EV charging)

### Examples

**Scenario:** An electrician carries out a periodic EICR on a 1970s-era commercial office building. The TN-S supply has measured Ze of 0.35 ohm. During testing, Circuit 7 (a 32A radial feeding a server room) records an earth fault loop impedance Zs of 1.82 ohm — exceeding the 1.37 ohm maximum for a Type B 32A MCB (BS 7671, Table 41.3). The circuit would not disconnect within the required 5-second time for a fixed installation. This is coded C2 (potentially dangerous) because a fault on this circuit could leave exposed metalwork live for an extended period. Additionally, Circuit 12 (kitchen ring final) shows an insulation resistance of 0.8 megohm between L-E — below the 1.0 megohm minimum, coded C2. The overall installation is classified "Unsatisfactory" due to two C2 observations. A C3 (improvement recommended) is also noted for lack of SPD protection on the incoming supply.

**Report Excerpt:**
```
ELECTRICAL INSTALLATION CONDITION REPORT (EICR)
BS 7671:2018+A2:2022 | 18th Edition
Client: Apex Office Solutions Ltd
Installation Address: 14 Corporation Street, Birmingham, B2 4RN
Date of Inspection: 2026-02-25 | Previous EICR: 2021-03-12

Supply: TN-S | Ze: 0.35 ohm | PSCC: 2.8 kA

OVERALL ASSESSMENT: UNSATISFACTORY

OBSERVATIONS:
Ref   Circuit       Code  Observation
4.7   Cct 7 (32A)   C2   Zs = 1.82 ohm, exceeds max 1.37 ohm for Type B
                          32A MCB. Disconnection time not met (Table 41.3).
4.12  Cct 12 (ring)  C2   IR (L-E) = 0.8 M ohm, below 1.0 M ohm minimum
                          (Table 61). Possible insulation degradation.
4.1   Main switch    C3   No Type 2 SPD fitted. Recommended per BS 7671
                          Section 534 for commercial premises.

Inspector: M. Greenwood, City & Guilds 2391-52
NICEIC Registration: #29174 | Report Date: 2026-02-25
```

---

## 4. ISO 17020 — Conformity Assessment for Inspection Bodies

**Full name:** ISO/IEC 17020: Conformity Assessment — Requirements for the Operation of Various Types of Bodies Performing Inspection (2012)

**Issued by:** ISO/IEC

**Governs:** Competence, impartiality, and consistency of inspection bodies. The accreditation standard — TIC companies must hold this to be recognised as competent for statutory inspections. National accreditation bodies (UKAS, DAkkS, COFRAC) audit against this standard.

### Types of Inspection Bodies
| Type | Independence Level | Description |
|------|-------------------|-------------|
| **A** | Highest | Independent third-party. Cannot be designer, manufacturer, supplier, purchaser, owner, or user of items inspected |
| **B** | Moderate | In-house inspection. Services only to own organisation. Cannot inspect own work |
| **C** | Lowest | May be involved in design/manufacture/supply BUT must have impartiality safeguards |

### Key Requirements
- **Competence:** Qualified personnel (education + training + experience). Documented criteria per inspection type. Ongoing performance monitoring. Formal authorisation records
- **Impartiality:** Management commitment. Risk identification and management. No remuneration dependent on results. Impartiality committee may be required (Type A)
- **Reports:** Accurate, clear, unambiguous. Include all necessary interpretation info. Authorised before release. Records retained (typically 6+ years)

### Key Clauses
- Clause 4: General (legal entity, impartiality, confidentiality)
- Clause 5: Structural (organisational structure, independence)
- Clause 6: Resources (personnel, facilities, equipment, subcontracting)
- Clause 7: Process (methods, handling, records, reports, complaints)
- Clause 8: Management system (Option A or B)

### Examples

**Scenario:** During a UKAS surveillance assessment, a Type A inspection body providing statutory lifting equipment inspections is audited against ISO 17020. The assessor reviews personnel records and finds that 2 of 12 lifting inspectors were authorised to perform thorough examinations of mobile elevating work platforms (MEWPs) without evidence of MEWP-specific training — only general lifting equipment training is documented. This is raised as a non-conformity under Clause 6.1.6 (competence must be demonstrated for each specific type of inspection). Additionally, the assessor discovers that the inspection body subcontracted NDT work to a company whose ISO 17025 accreditation lapsed 3 months earlier, without verifying current accreditation status — a non-conformity under Clause 6.3 (subcontracting). The inspection body has 3 months to demonstrate corrective action or face scope reduction.

**Report Excerpt:**
```
UKAS ASSESSMENT REPORT — ISO/IEC 17020:2012
Inspection Body: National Technical Inspections Ltd (Type A)
Accreditation No: 1842 | Assessment Date: 2026-01-22
Lead Assessor: Dr. S. Whitfield, UKAS

NON-CONFORMITY 1 — Clause 6.1.6 (Competence)
  Finding: Inspectors #INS-07 and #INS-11 authorised for MEWP thorough
  examinations. Personnel files show general lifting training only.
  No evidence of MEWP-specific competence (manufacturer training,
  IPAF certification, or equivalent). Authorisation matrix does not
  differentiate MEWP from general lifting equipment.
  Required action: Provide evidence of MEWP-specific competence for
  both inspectors, or withdraw authorisation. Due: 2026-04-22.

NON-CONFORMITY 2 — Clause 6.3 (Subcontracting)
  Finding: NDT subcontractor (MetTest Labs) used for MPI on 3 jobs
  (Dec 2025 - Jan 2026). MetTest ISO 17025 accreditation expired
  2025-10-15. No evidence of accreditation verification prior to
  engagement.
  Required action: Verify current accreditation of all subcontractors.
  Review results from affected jobs. Due: 2026-04-22.
```

---

## 5. PED — Pressure Equipment Directive

**Full name:** Pressure Equipment Directive 2014/68/EU (UK: Pressure Equipment (Safety) Regulations 2016)

**Issued by:** European Commission (UK has retained version post-Brexit)

**Governs:** Design, manufacture, and conformity assessment of pressure equipment >0.5 bar. "Placing on the market" directive — applies when equipment is first sold/put into service. Does NOT cover in-service inspection (that's API 510 or national regulations).

### Fluid Groups
- **Group 1:** Dangerous fluids (explosive, flammable, toxic, oxidising)
- **Group 2:** All other fluids (steam, compressed air, nitrogen, water)

### Equipment Categories (I–IV)
Determined by: equipment type × fluid group × fluid state × pressure × volume/nominal size

| Category | Risk Level | Conformity Assessment |
|----------|-----------|----------------------|
| **I** | Lowest | Module A — manufacturer self-certifies |
| **II** | Moderate | Module A2, D1, or E1 — supervised production checks |
| **III** | Significant | Module B+D, B+F, B+E, B+C2, or H — Notified Body examines type |
| **IV** | Highest | Module B+D, B+F, G, or H1 — Notified Body verifies each unit |

Below Category I: Article 4.3 (sound engineering practice) — no CE marking required.

### Key Conformity Modules
| Module | Description |
|--------|-------------|
| A | Internal production control (self-certification) |
| B | EU-type examination by Notified Body |
| D/D1 | Production quality assurance (NB audits QMS) |
| F | Product verification (NB examines/tests every product) |
| G | Unit verification (NB examines each individual item) |
| H/H1 | Full quality assurance (NB approves entire QMS covering design + production + testing) |

### CE/UKCA Marking
- Categories I-IV must bear CE (EU) or UKCA (UK) marking
- Categories III-IV: marking includes Notified Body identification number
- Accompanied by Declaration of Conformity

### Examples

**Scenario:** A manufacturer in Northern England produces shell-and-tube heat exchangers for the petrochemical industry. A new unit is designed for 45 bar maximum allowable pressure, 200L volume, carrying Group 1 fluid (ethylene oxide). The PS x V product is 9,000 bar-litre, placing it in PED Category III. The manufacturer applies via Module B+D: the Notified Body (NB 0045) examines the technical file and a representative unit (Module B — EU-type examination), then audits the manufacturer's production quality system (Module D). During the Module B examination, the NB discovers the manufacturer's weld procedure specification references EN ISO 15614-1:2004 rather than the current 2017 revision. The manufacturer must requalify the procedure to the current standard before the EU-type examination certificate can be issued.

**Report Excerpt:**
```
EU-TYPE EXAMINATION CERTIFICATE — PED 2014/68/EU, Module B
Notified Body: TUV Rheinland (NB 0045)
Certificate No: 01-PED-2026-1847
Manufacturer: Northern Pressure Systems Ltd, Middlesbrough, UK
Equipment: Shell-and-tube heat exchanger, Type HX-450
Max pressure (PS): 45 bar | Volume (V): 200 L | Fluid group: 1
Category: III (PS x V = 9,000 bar-L, Group 1 gas)

ESSENTIAL REQUIREMENTS ASSESSED: Annex I, Sections 1-4, 7

FINDINGS:
  Design calculations: Verified per EN 13445-3. Adequate.
  Materials: SA-516 Gr.70, certificates per EN 10204 3.2. Compliant.
  Welding: WPS references EN ISO 15614-1:2004 — NON-COMPLIANT.
    Current harmonised standard is EN ISO 15614-1:2017.
    Weld procedure requalification required before certificate issue.
  NDT: 100% RT on longitudinal seams per EN 13445-5. Acceptable.
  Pressure test: Hydrostatic at 65.25 bar (1.45 x PS). Passed, no leaks.

STATUS: CERTIFICATE WITHHELD pending WPS requalification.
Examiner: Dipl.-Ing. K. Braun | Date: 2026-02-14
```

---

## 6. PUWER — Provision and Use of Work Equipment Regulations 1998

**Full name:** The Provision and Use of Work Equipment Regulations 1998 (SI 1998/2306)

**Issued by:** UK HSE

**Governs:** Virtually ALL work equipment used in UK workplaces. From hand tools to CNC machines, ladders to industrial robots. Sets general duties; specific regulations (LOLER, Supply of Machinery Regulations) apply in addition where relevant.

### Key Regulations
| Reg | Requirement |
|-----|-------------|
| 4 | **Suitability** — equipment must be suitable for intended use and conditions |
| 5 | **Maintenance** — efficient state, efficient working order, good repair |
| 6 | **Inspection** — after installation, assembly at new location, at suitable intervals. By competent person. Results recorded |
| 7 | Specific risks — restrict use to designated persons |
| 8 | Information and instructions — adequate H&S info, written instructions |
| 9 | Training — all users, supervisors, managers |
| 11-13 | **Dangerous parts** — guarding requirements |
| 14-18 | **Controls** — start, stop, emergency stop, control systems |
| 19 | Isolation from energy sources |
| 25-29 | Mobile work equipment |
| 30-35 | **Power presses** — thorough examination every 12 months, operator inspection every 4 hours |

### Inspection Requirements
- "At suitable intervals" — risk-based, depends on equipment type/environment/use
- By "competent person" — sufficient training, experience, knowledge
- Results recorded and available
- **Power presses:** prescriptive — thorough examination every 12 months + operator check every shift

### Examples

**Scenario:** An HSE inspector visits a food packaging factory following an employee injury report. A semi-automatic case erector had its interlocked guard defeated with a cable tie — operators bypassed it because it slowed changeovers. The investigation reveals no risk assessment was conducted when the machine was relocated from a different production line 6 months ago (PUWER Reg 6 requires inspection after assembly at a new location). The guard interlock was also found to be a non-captive type, making defeat easy (Reg 11 — guards must not be easily bypassed). The employer receives an Improvement Notice requiring: a new risk assessment for the relocated machine, replacement of the guard interlock with a captive coded type, and retraining of all operators. A Prohibition Notice is served on the machine itself until the interlock is replaced.

**Report Excerpt:**
```
PUWER INSPECTION RECORD
Site: FreshPack Ltd, Warrington, WA4 6PL
Equipment: Semi-automatic case erector, Make: Endoline 221
Serial: E221-2018-0094 | Location: Line 3 (relocated from Line 1, Sep 2025)
Inspection Date: 2026-03-01 | Inspector: HSE Inspector C. Dunn

FINDINGS:
Reg 6 (Inspection): No inspection record following relocation from
  Line 1 to Line 3 in Sep 2025. Machine was reassembled at new
  location without competent person sign-off. NON-COMPLIANT.

Reg 11 (Dangerous parts): Interlocked guard on infeed section
  defeated with cable tie. Interlock is non-captive tongue type —
  easily bypassed without tools. Operators report guard was bypassed
  "for the last 3 months" to speed changeovers. NON-COMPLIANT.

Reg 9 (Training): No evidence of retraining after relocation.
  Operators unfamiliar with revised emergency stop locations.
  NON-COMPLIANT.

ACTIONS:
  Prohibition Notice served — machine out of service until Reg 11
  interlock replaced with captive coded type (e.g., Schmersal AZM201).
  Improvement Notice — risk assessment + Reg 6 inspection + Reg 9
  retraining. Compliance due: 2026-03-29.
```

---

## 7. ISO 9001 — Quality Management Systems

**Full name:** ISO 9001:2015 — Quality Management Systems — Requirements

**Issued by:** ISO Technical Committee TC 176

**Governs:** Requirements for a quality management system (QMS). Most widely used management system standard globally. TIC relevance: (1) TIC companies themselves are certified, (2) TIC companies audit clients against ISO 9001.

### Key Clauses
| Clause | Topic | What's Assessed |
|--------|-------|-----------------|
| 4 | Context | Organisation understanding, interested parties, scope, processes |
| 5 | Leadership | Commitment, policy, roles/responsibilities |
| 6 | Planning | Risks and opportunities, objectives, change planning |
| 7 | Support | Resources, competence, awareness, communication, documented info |
| **8** | **Operation** | Planning, requirements, design, external provision, production, release, nonconforming outputs |
| **9** | **Performance evaluation** | Monitoring, internal audit, management review |
| **10** | **Improvement** | Nonconformity, corrective action, continual improvement |

### Audit Types
| Type | Frequency | Scope |
|------|-----------|-------|
| Stage 1 | Once (initial certification) | Documentation review, readiness assessment |
| Stage 2 | Once (initial certification) | Full on-site implementation assessment |
| Surveillance | 1-2x per year | Subset of processes, follow-up on previous findings |
| Recertification | Every 3 years | Full reassessment |

### Nonconformity Classification
| Classification | Definition | Impact on Certification |
|---------------|-----------|------------------------|
| **Major NC** | Absence or total breakdown of a system. OR probable shipment of nonconforming product | Prevents/suspends certification until corrected (typically 90 days) |
| **Minor NC** | Single observed lapse. System exists but had a gap | Must be corrected before next surveillance |
| **Observation/OFI** | Potential weakness, area for improvement | No corrective action required |

### Examples

**Scenario:** A certification body conducts an annual surveillance audit of a plastics injection moulding company certified to ISO 9001:2015. During the Clause 8.4 (external provision) review, the auditor examines purchase orders for a critical raw material — virgin ABS pellets. The specification requires melt flow index (MFI) between 18-22 g/10min, but incoming inspection records show 3 of the last 10 batches had MFI values of 16.1, 15.8, and 17.2 — all below specification. All three batches were accepted and used in production with no documented concession or deviation record. The auditor raises a Major NC: the company has no process for handling incoming materials that fail specification, meaning nonconforming material entered production without evaluation. Additionally, a Minor NC is raised under Clause 7.1.5 (monitoring resources) because the MFI tester's calibration certificate has expired by 6 weeks.

**Report Excerpt:**
```
ISO 9001:2015 SURVEILLANCE AUDIT REPORT
Client: Precision Mouldings (UK) Ltd
Certificate No: QMS-2024-08814 | Audit Date: 2026-02-10
Lead Auditor: R. Fernandez, IRCA Lead Auditor #A21947

MAJOR NONCONFORMITY — NCR-2026-001
  Clause: 8.4.2 (Type and extent of control) / 8.7 (Control of
          nonconforming outputs)
  Finding: Incoming inspection records for ABS pellets show 3/10
  batches below MFI specification (16.1, 15.8, 17.2 vs. required
  18-22 g/10min). All three batches accepted into production. No
  concession, deviation, or nonconforming material report raised.
  Procedure QP-08 "Incoming Inspection" does not define action for
  out-of-spec results.
  Impact: Nonconforming raw material used in production of safety-
  critical automotive components without risk evaluation.
  Corrective action due: 2026-05-10 (90 days).

MINOR NONCONFORMITY — NCR-2026-002
  Clause: 7.1.5 (Monitoring and measuring resources)
  Finding: MFI tester (Instron CEAST MF20, S/N: CF-2019-441)
  calibration certificate expired 2025-12-28. No evidence of
  recalibration or interim verification since expiry.
  Corrective action due: Before next surveillance audit.
```

---

## 8. ISO 17025 — Testing and Calibration Laboratory Competence

**Full name:** ISO/IEC 17025:2017 — General Requirements for the Competence of Testing and Calibration Laboratories

**Issued by:** ISO/IEC

**Governs:** Competence, impartiality, and consistent operation of testing and calibration laboratories. The accreditation standard for labs (analogous to ISO 17020 for inspection bodies). Many TIC companies operate labs (materials testing, chemical analysis, calibration services) that must be accredited to this standard.

### Key Requirements

**Measurement Uncertainty** — The distinguishing requirement:
- Identify all contributions to uncertainty for each method
- Evaluate using GUM (Guide to Expression of Uncertainty in Measurement)
- Report with results when relevant to validity, client requests, or conformity decisions
- Budget: reference standard uncertainty, environmental effects, operator effects, equipment resolution, repeatability, reproducibility

**Metrological Traceability:**
- All results traceable to SI units through unbroken chain of calibrations
- Reference standards calibrated by competent body (National Metrology Institute or accredited lab)
- Calibration certificates must include: results with uncertainty, method, traceability chain

### Report Requirements
Test reports / calibration certificates must include: title, lab name/address, unique ID, client, item description, dates, method reference, results with units, measurement uncertainty (where applicable), conditions, conformity statement with decision rule, authorisation.

### Key Clauses
- 6.4: Equipment (calibration, maintenance, records)
- 6.5: Metrological traceability
- 7.2: Method selection, verification, validation
- 7.6: Measurement uncertainty evaluation
- 7.7: Validity of results (proficiency testing, internal QC)
- 7.8: Reporting

### Examples

**Scenario:** A UKAS-accredited materials testing laboratory participates in a proficiency testing (PT) scheme for Charpy impact testing of steel specimens. The lab's results for a round of low-temperature tests (-40C) show a z-score of 3.2 — exceeding the |z| > 3.0 threshold that flags an "unsatisfactory" result per ISO 17043. The lab must investigate the root cause under ISO 17025 Clause 7.7.2. Investigation reveals the temperature conditioning bath was holding at -36C instead of -40C due to a faulty thermocouple. The thermocouple was last calibrated 14 months ago (lab procedure requires 12-monthly recalibration) — an additional non-conformity under Clause 6.4. The lab must review all Charpy results produced since the last valid calibration (approximately 180 test reports), assess whether any reported results were affected, and notify clients where conformity decisions may have been compromised.

**Report Excerpt:**
```
TEST REPORT — ISO/IEC 17025:2017
Lab: Central Metallurgical Testing Ltd | UKAS Accreditation: 1295
Report No: CMT-2026-02-0447 | Date Issued: 2026-02-20
Client: Tata Steel UK Ltd

Specimen: Charpy V-notch impact test, EN ISO 148-1:2016
Material: S355J2+N structural steel plate, Heat No: 84291-T
Specimen size: 10 x 10 x 55 mm, V-notch 2mm depth
Test temperature: -20C (conditioned in ethanol bath, 10 min min.)

RESULTS:
  Specimen 1:  47 J    Lateral expansion: 0.62 mm
  Specimen 2:  52 J    Lateral expansion: 0.71 mm
  Specimen 3:  44 J    Lateral expansion: 0.58 mm
  Mean:        47.7 J  (Requirement per EN 10025-2: min 27 J at -20C)

MEASUREMENT UNCERTAINTY: +/- 2.1 J (k=2, 95% confidence)
  Sources: machine verification (0.8 J), temperature conditioning
  (0.4 J), specimen preparation (0.3 J), repeatability (1.6 J).

CONFORMITY STATEMENT: PASS (decision rule: simple acceptance per
  ILAC-G8:09/2019 — result minus uncertainty exceeds requirement:
  47.7 - 2.1 = 45.6 J > 27 J).

Tested by: Dr. L. Chen | Authorised by: P. Okonkwo, Lab Manager
```

---

## Quick Reference: Which Standard Applies Where

| Inspection Type | Primary Standards |
|----------------|-------------------|
| Pressure vessels (in-service) | API 510, PSSR 2000, API 579 |
| Pressure equipment (new build) | PED 2014/68/EU, ASME BPVC VIII |
| Lifting equipment | LOLER 1998, PUWER 1998, ISO 4309 |
| Electrical installations | BS 7671, Electricity at Work Regs 1989 |
| NDT operations | ISO 9712, ASME V, technique-specific EN ISOs |
| Factory audits / QMS | ISO 9001, ISO 19011, ISO/IEC 17021-1 |
| Inspection body accreditation | ISO/IEC 17020 |
| Laboratory operations | ISO/IEC 17025 |
| Fire safety | RRFSO 2005, BS 5839-1, BS 9999, PAS 79 |
| General work equipment | PUWER 1998 |

---

## Key Insight for Scope AI

**The same physical defect may be acceptable under one standard and rejectable under another.** Scope's compliance checking must be calibrated per standard. Template configuration must reference the specific standard's acceptance criteria, classification system, and report format requirements. There is no "universal" defect classification — each domain has its own taxonomy.
