# TIC Inspection Types — Knowledge Base
# Layer 1: Industry Knowledge
# Last Updated: 2026-03-02

---

## Overview

Six primary inspection types in TIC. Each has distinct process flows, instruments, report structures, and governing standards. Understanding these differences is critical for template configuration — a pressure vessel template cannot be repurposed for an electrical inspection.

---

## 1. Pressure Vessel Inspection

### What It Is
Examination of equipment operating above atmospheric pressure: boilers, heat exchangers, reactors, storage tanks, process columns. Catastrophic failure risk (explosion, toxic release). Found across oil & gas, petrochemicals, power generation, pharma, food processing, water treatment.

### Process Flow
1. **Pre-inspection** — Review previous records, design docs, Written Scheme of Examination (WSE), operating history
2. **Isolation & prep** — Depressurise, drain, clean, gas-free. Confined space permits. Scaffolding if needed
3. **External visual** — Corrosion, bulging, cracking, insulation damage, supports, nozzles, nameplate
4. **Internal visual** — Corrosion, erosion, cracking, pitting, lining degradation, weld condition
5. **NDT** — Ultrasonic thickness at TMLs (Thickness Monitoring Locations). MPI/DPT on welds as needed
6. **Fitness-for-service** — If defects found, assess per API 579. Calculate remaining life and corrosion rates
7. **Pressure test** — Hydrostatic at 1.5x MAWP if required
8. **Report** — All findings, measurements, photos, NDT results, recommendations, next inspection date

### Key Data Fields
- Vessel ID (tag, serial, manufacturer, year, MAWP, design temp, material)
- Thickness readings: location, nominal, previous, current, corrosion rate (mm/yr), min required, remaining life (yrs)
- Visual findings: location, defect type, severity, dimensions, photos
- NDT results: method, area, indication type, accept/reject
- Overall condition rating, fitness-for-service determination
- Next examination date

### Instruments
- Ultrasonic thickness gauge (Olympus 38DL, GE DMS Go+)
- Phased array UT / TOFD for crack detection and sizing
- MPI equipment (yoke, particles, UV light)
- Dye penetrant kit
- Pit depth gauge, hardness tester, borescope
- Thermography camera (CUI detection)

### Key Standards
- **API 510** — In-service inspection code (intervals, repairs, re-rating)
- **PED 2014/68/EU** — Design and manufacture conformity
- **PSSR 2000** — UK regulation requiring WSE
- **ASME BPVC Section VIII** — Design and fabrication rules
- **API 579** — Fitness-for-service assessment

### Common Defects
| Type | Severity | Notes |
|------|----------|-------|
| General corrosion | Low–High | Depends on remaining thickness |
| Localised pitting | Medium–High | Hard to predict progression |
| Cracking (fatigue, SCC, HIC) | High–Critical | Can cause sudden failure |
| Erosion | Medium | Predictable if process conditions known |
| Metallurgical damage (creep, embrittlement) | High | Requires specialist assessment |
| Weld defects | Variable | Per original fabrication code |

### Deployment Notes
- **Protocol-driven.** Inspectors follow exact sequences. Template must match their specific WSE flow
- **Data-heavy.** Core value is trending thickness readings over time — AI excels here
- **High-value AI application:** Automated corrosion rate trending, remaining life prediction, anomaly detection in readings

---

## 2. Lifting Equipment Inspection

### What It Is
Examination of all lifting equipment: cranes (overhead, mobile, tower), hoists, lifts/elevators, forklifts, lifting accessories (slings, shackles, hooks, eyebolts, spreader beams), vehicle tail-lifts, patient hoists, powered access platforms.

### Process Flow
1. **Pre-inspection** — Previous reports, manufacturer's instructions, SWL/WLL, maintenance records
2. **Visual examination** — Structural members, welds, wire ropes, chains, hooks, sheaves, drums, brakes, limit switches, guards, SWL markings
3. **Functional testing** — Full range of motion, brakes under load, limit switches, emergency stop, all safety devices
4. **Load testing** (if required) — 125% SWL proof load. Static and dynamic tests
5. **Measurement** — Wire rope diameter, chain stretch, hook throat opening, brake pad thickness
6. **Report** — LOLER Report of Thorough Examination

### Key Data Fields
- Equipment ID (type, manufacturer, model, serial, SWL/WLL, year)
- Wire rope: diameter nominal vs measured, broken wires per pitch length, corrosion grade
- Chain: link diameter nominal vs measured (stretch), defective links
- Hook: throat opening nominal vs measured, wear, latch condition
- Safety device tests: limit switches, overload, emergency stop — pass/fail
- Load test results: test load, duration, deflection
- Condition: safe / repairs required by [date] / must not be used / imminent danger

### Instruments
- Vernier caliper, wire rope gauge, hook throat gauge
- Calibrated load cell / dynamometer, certified test weights
- MPI equipment (for structural crack detection)
- UT gauge (structural member thickness)
- Brake testing equipment

### Key Standards
- **LOLER 1998** — UK legislation. 6-month intervals for accessories and equipment lifting persons, 12-month for others
- **PUWER 1998** — General work equipment requirements
- **ISO 4309** — Wire rope discard criteria
- **BS 7121** — Safe use of cranes
- **BS EN 81** — Lift safety rules

### Common Defects
| Type | Severity | Discard Criteria |
|------|----------|-----------------|
| Wire rope: broken wires | Medium–Discard | Per ISO 4309 tables |
| Wire rope: >10% diameter reduction | Discard | Immediate |
| Chain: >5% stretch (Grade 80) | Discard | Immediate |
| Hook: >5% throat opening increase | Discard | Immediate |
| Safety device failure (limit switch, overload) | Critical | Equipment must not be used |
| Structural cracking | Medium–Critical | Per engineering assessment |

### Deployment Notes
- **Highest volume** inspection type. Single client may have 10,000+ lifting accessories
- **Reports must be produced within 28 days** (immediately if imminent danger)
- **LOLER report format is prescribed** by regulation — relatively standardised
- **High-value AI application:** Volume automation, scheduling, asset register management

---

## 3. Electrical Inspection

### What It Is
Two categories: (1) **Fixed wiring inspection (EICR)** — periodic assessment of building electrical installations, and (2) **Portable Appliance Testing (PAT)** — testing of movable electrical equipment. Leading cause of fires and electrocution.

### Process Flow (EICR)
1. **Planning** — Obtain previous EICR, original certificates, DB schedules. Agree scope and sampling
2. **Visual inspection (dead)** — Distribution boards, labelling, CPD types/ratings, cable sizing, earthing/bonding, accessories condition, cable management
3. **Dead testing** — Continuity of protective conductors (R1+R2), ring circuit continuity, insulation resistance (min 1 MΩ at 500V DC)
4. **Live testing** — Earth fault loop impedance (Zs), prospective fault current, polarity, RCD trip times (must trip within 40ms at 5x rated)
5. **Classification** — Each observation coded: C1 (danger present), C2 (potentially dangerous), C3 (improvement recommended), FI (further investigation)
6. **Report** — EICR per BS 7671 model forms. Overall: Satisfactory or Unsatisfactory

### Key Data Fields
- Installation: address, purpose, earthing system (TN-S/TN-C-S/TT), phases, supply details
- Per circuit: reference, description, CPD type/rating, cable type/size, R1+R2, IR, Zs, RCD trip time
- Observations: item number, location, description, code (C1/C2/C3/FI), recommendation
- Overall assessment: Satisfactory (no C1/C2) or Unsatisfactory (any C1/C2)

### Observation Codes
| Code | Meaning | Action | Makes Installation "Unsatisfactory" |
|------|---------|--------|--------------------------------------|
| **C1** | Danger present | Immediate remedial action | Yes |
| **C2** | Potentially dangerous | Urgent remedial action | Yes |
| **C3** | Improvement recommended | Not dangerous, advisory | No |
| **FI** | Further investigation required | Cannot fully assess without more work | No (but needs resolution) |

### Instruments
- Multifunction installation tester (Megger MFT1741, Fluke 1664 FC) — all fixed wiring tests
- PAT tester (Megger PAT420, Seaward Apollo 600+) — portable appliance tests
- Proving unit / voltage indicator — safe isolation verification
- Thermal imaging camera — hot spot detection in distribution boards

### Key Standards
- **BS 7671 (18th Edition)** — IET Wiring Regulations. Design, installation, verification
- **Electricity at Work Regulations 1989** — Legal requirement for periodic inspection
- **IET Code of Practice** — PAT testing guidance
- **IET Guidance Note 3** — Inspection and testing detail

### Deployment Notes
- **Most tabular** report type — test results are almost entirely numerical
- **Observation codes are nationally standardised** but inspector descriptions vary enormously
- **High-value AI application:** Automated test result recording, consistent code classification, certificate generation
- **Recommended intervals:** Domestic 10yr, commercial 5yr, industrial 3yr, swimming pools 1yr

---

## 4. NDT (Non-Destructive Testing)

### What It Is
Analytical techniques to evaluate material/component properties without causing damage. Five principal methods: ultrasonic (UT), radiographic (RT), magnetic particle (MT/MPI), liquid penetrant (PT/DPT), eddy current (ET/ECT). Used across virtually every inspection type.

### Methods Summary

| Method | Principle | Best For | Limitations |
|--------|-----------|----------|-------------|
| **UT** | Sound wave reflection from defects/surfaces | Wall thickness, crack detection/sizing, weld inspection | Surface access needed, couplant required, operator-dependent |
| **RT** | X-ray/gamma through material onto film/detector | Volumetric defects (porosity, slag), weld inspection | Radiation safety zones, slow, expensive, orientation-dependent |
| **MT/MPI** | Magnetic flux leakage at surface defects | Surface/near-surface cracks on ferromagnetic materials | Ferromagnetic only, surface access, demagnetisation needed |
| **PT/DPT** | Capillary action draws liquid into surface cracks | Surface cracks on any non-porous material | Surface-breaking only, surface prep critical, temperature limits |
| **ET/ECT** | Eddy current impedance changes from defects | Tube inspection, surface cracks, conductivity, coating thickness | Conductive materials only, limited depth, geometry-sensitive |

### Key Sub-Techniques
- **Phased Array UT (PAUT)** — Array of elements, sector scans. Replacing radiography for many weld applications
- **Time of Flight Diffraction (TOFD)** — Gold standard for crack sizing
- **Guided Wave UT** — Long-range pipeline screening (50m+ from one probe position)
- **Digital Radiography (DR)** — Real-time, no film/chemicals. Transition in progress
- **Pulsed Eddy Current** — CUI detection without insulation removal

### Personnel Certification Levels
| Level | Can Do |
|-------|--------|
| **Level 1** | Performs under supervision, follows written instructions |
| **Level 2** | Performs and reports independently, selects technique |
| **Level 3** | Method expert, writes procedures, audits, trains |

Certification schemes: **PCN** (UK, BINDT), **CSWIP** (TWI), **SNT-TC-1A** (US, ASNT), all per **ISO 9712**.

### Key Standards
- **ISO 9712** — NDT personnel certification
- **ASME V** — NDE methods and procedures
- **EN ISO 17636** — RT of welds
- **EN ISO 17640** — UT of welds
- **EN ISO 9934** — Magnetic particle testing
- **EN ISO 3452** — Penetrant testing

### Common Defects Detected
| Defect | Description | Primary NDT Method |
|--------|-------------|-------------------|
| Porosity | Gas pores in weld/casting | RT, UT |
| Slag inclusions | Non-metallic trapped in weld | RT, UT |
| Lack of fusion | Weld not bonded to parent metal | UT (PAUT), RT |
| Cracks (surface) | Fatigue, SCC, solidification | MT, PT, ET |
| Cracks (internal) | Sub-surface flaws | UT (TOFD for sizing), RT |
| Corrosion (wall loss) | General thinning or pitting | UT, ET (tubes) |

### Deployment Notes
- **Most technically dense** report type — data highly technique-specific
- **A single weld may have UT + RT + MPI + DPT reports** — each with different data structures
- **High-value AI application:** Automated indication classification, trending over time, acceptance/rejection per code

---

## 5. Factory Audit / Manufacturing Inspection

### What It Is
Systematic assessment of manufacturing facilities, production processes, and quality management systems. Includes ISO 9001 QMS audits, manufacturing surveillance, pre-shipment inspections, and lab accreditation audits. Examines the **system and processes**, not the product itself.

### Process Flow (QMS Audit)
1. **Stage 1** — Documentation review, readiness assessment
2. **Audit planning** — Scope, schedule, team assignment, process/department allocation
3. **Opening meeting** — Purpose, methodology, classification system
4. **Stage 2 (on-site):**
   - Process observation — verify operations match documented procedures
   - Document/record review — sample inspection records, calibration, training, corrective actions, management review
   - Interviews — operators, supervisors, quality managers
   - Traceability check — finished product traced back through raw materials, in-process, final inspection
   - Measurement equipment — calibration status, traceability to national standards
5. **Finding classification** — Major NC, Minor NC, Observation/OFI
6. **Closing meeting** — Present findings, agree corrective action timeline
7. **Report** — Formal audit report
8. **Corrective action review** — Client submits evidence, auditor verifies
9. **Certification decision** — Certify (3-year cycle with annual surveillance) or withhold

### Finding Classifications
| Classification | Definition | Impact |
|---------------|-----------|--------|
| **Major NC** | Absence or total breakdown of a system. OR would result in shipping nonconforming product | Prevents/suspends certification until corrected |
| **Minor NC** | Single observed lapse. System exists but had a gap | Must be corrected, doesn't prevent certification |
| **Observation/OFI** | Potential weakness, area for improvement | No corrective action required, advisory |

### AQL Sampling (Manufacturing Inspection)
Acceptance Quality Level per ISO 2859-1:
- **Critical defects:** AQL 0 (zero acceptance) — could cause harm
- **Major defects:** AQL 2.5 — renders product unfit for purpose
- **Minor defects:** AQL 4.0 — departure from spec but usable

### Key Standards
- **ISO 9001:2015** — QMS requirements (most widely applied globally)
- **ISO 19011:2018** — Audit guidelines
- **ISO/IEC 17021-1** — Certification body requirements
- **ISO/IEC 17020** — Inspection body accreditation
- **ISO 2859-1** — AQL sampling plans
- **Sector-specific:** IATF 16949 (automotive), AS 9100 (aerospace), ISO 13485 (medical devices), ISO 22000 (food safety)

### Deployment Notes
- **Process-based, not asset-based.** Inspects management systems, not physical items
- **Findings are largely textual** — require significant domain knowledge to interpret
- **High-value AI application:** Pattern recognition across audits (which clauses generate most NCs), corrective action tracking, automated clause-to-finding mapping

---

## 6. Fire Safety Inspection

### What It Is
Assessment of premises fire precautions. Three primary activities: (1) **Fire Risk Assessment (FRA)** — comprehensive evaluation of fire hazards and precautions, (2) **Fire Door Inspection** — condition assessment of fire-resisting doorsets, (3) **Fire Alarm Testing** — verification of detection and alarm system functionality.

### Process Flow (FRA)
1. **Preparation** — Building info, floor plans, previous FRA, construction details, occupancy
2. **Fire hazards** — Identify ignition sources, fuel sources, oxygen sources
3. **People at risk** — All occupants, especially vulnerable groups (sleeping, disabled, children)
4. **Evaluate precautions:**
   - Detection and warning (BS 5839-1 category L1-L5/P1-P2)
   - Means of escape (travel distances, exit widths, emergency lighting, signage)
   - Fire-fighting equipment (extinguishers, risers, sprinklers)
   - Compartmentation (fire-resisting walls/floors/doors, fire stopping)
   - Management (emergency plan, drills, training, fire wardens)
5. **Risk rating** — Likelihood × Consequence = Trivial / Tolerable / Moderate / Substantial / Intolerable
6. **Action plan** — Prioritised deficiencies with recommended actions and timescales
7. **Report** — Per PAS 79 methodology

### Fire Door Key Checks
- Fire label present and legible (FD30/FD60/FD90)
- Gaps: 2-4mm at head and jambs, max 8-10mm at threshold
- Intumescent strips and smoke seals: present, undamaged, not painted over
- Self-closing device: functional, door closes fully from any angle
- Minimum 3 hinges for FD30
- Glazing: fire-rated glass with correct beading
- Signage: "Fire door keep shut" / "keep locked shut" / "automatic fire door keep clear"

### Fire Alarm Categories (BS 5839-1)
| Category | Coverage | Purpose |
|----------|----------|---------|
| L1 | Throughout building | Maximum life protection |
| L2 | Defined areas (escape routes + high-risk rooms) | Life protection |
| L3 | Escape routes only | Life protection |
| L4 | Escape routes within accommodation | Life protection (residential) |
| L5 | As defined by fire engineer | Specific life protection |
| P1 | Throughout building | Property protection |
| P2 | Defined areas | Property protection |

### Risk Rating Matrix
| Priority | Definition | Timescale |
|----------|-----------|-----------|
| **Intolerable** | Serious risk to life | Immediate — before premises continue in use |
| **Substantial** | Significant risk | Days/weeks |
| **Moderate** | Risk exists, not immediately critical | 1-3 months |
| **Tolerable** | Acceptable with current controls | Monitor |

### Key Standards
- **RRFSO 2005** — Primary UK fire safety legislation
- **Building Safety Act 2022** — Enhanced requirements for higher-risk buildings
- **BS 5839-1** — Fire detection and alarm systems
- **BS 9999** — Fire safety in buildings (code of practice)
- **BS 8214** — Fire door assemblies
- **PAS 79-1/79-2** — Fire risk assessment methodology
- **BS 5266-1** — Emergency lighting

### Instruments
- Gap gauge / feeler gauge (fire door gaps)
- Smoke detector test device (Solo 330, Testifire)
- Sound level meter (alarm sounder dB measurement)
- Lux meter (emergency lighting, min 1 lux on escape routes)
- Laser distance meter (travel distance measurement)
- Thermal imaging camera (hot spot detection)

### Deployment Notes
- **Most qualitative** inspection type — significant professional judgment required
- **Two assessors may produce substantially different risk ratings** for the same building
- **High-value AI application:** Consistency enforcement, standardised risk rating methodology, action plan tracking
- **Legal requirement:** FRA must be reviewed regularly (typically annually) or when significant changes occur

---

## Cross-Cutting Patterns

### What's Common Across All Types
1. **Structured report with standard sections** — header, scope, methodology, findings, conclusions, recommendations
2. **Defect classification system** — every type has severity grades (though the scales differ)
3. **Governing standards define ground truth** — same defect may be acceptable under one code, rejectable under another
4. **Inspector carries personal liability** — human-in-the-loop review is legally required in most cases
5. **Instruments generate digital data** — potential for direct instrument-to-report automation

### What Varies
1. **Data density:** Pressure vessels and NDT are data-heavy (thickness readings, scan images). Fire safety is narrative-heavy
2. **Protocol rigidity:** Automotive/aerospace inspections follow exact sequences. Construction/consumer products have more flexibility
3. **Volume:** Lifting accessories and PAT testing are highest volume (thousands of items per site). Pressure vessels are lower volume but higher complexity
4. **Regulatory format:** Each jurisdiction has specific report format requirements (KBA for German automotive, UKAS for UK, etc.)

### Key Insight for Template Configuration
Template configuration must mirror the **exact sequence inspectors actually follow**, not the documented process. Remote configuration from documentation alone fails for protocol-driven clients (TÜV SÜD lesson). On-site observation before configuration is critical for standardised-workflow clients.
