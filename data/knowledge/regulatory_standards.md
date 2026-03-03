# Regulatory Standards — Knowledge Base
# Layer 1: Industry Knowledge
# Last Updated: 2026-03-02

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
Must include: vessel ID, date, inspection type, NDE methods, thickness readings with locations, corrosion rate calculations, remaining life estimate, defects with descriptions and locations, FFS results (if applicable), recommendations, inspector certification number. All data maintained for life of vessel.

### Inspector Certification
API 510 Pressure Vessel Inspector — individual credential. Exam covers API 510, ASME VIII Div.1, API 572, API 576, API 571, NBIC. Recertification every 3 years.

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
Employer name/address, premises address, equipment particulars (description, ID, SWL), last examination date, next examination due, examination date, whether safe to operate, defects identified, competent person name/qualifications/signature.

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
