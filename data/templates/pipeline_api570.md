# Template Spec: Pipeline Inspection (API 570)

# Type: Client-Specific — Bureau Veritas Petrochemical Division

# Created: 2026-03-04

# Status: QA'd

---

## Confidence Legend

Each section is tagged with a confidence level indicating how its requirements were derived:

| Tag | Meaning | Source | Expected Client Adjustment |
|-----|---------|--------|---------------------------|
| `🟢 Regulatory` | Verified against published standard | API 570, API 574, ASME B31.3, PSSR 2000 | Minimal — mandated by regulation |
| `🟡 Industry Standard` | Common TIC practice, high confidence | Widely adopted across enterprise TIC companies | Low — may vary in format but substance is consistent |
| `🟠 Inferred` | Reasonable assumption based on domain knowledge | Derived from report anatomy, inspection type patterns, or general best practice | Moderate to high — expect client-specific adjustment |

---

## Overview

Pipeline in-service inspection template per API 570 (Piping Inspection Code). Designed for Bureau Veritas petrochemical refinery operations — carbon steel and alloy process piping in amine, hydrocarbon, and utility service.

**Inspection type:** Pipeline / Process Piping — In-Service Condition Assessment
**Primary standard:** API 570 (Piping Inspection Code)
**Supporting standards:** API 574 (Inspection Practices), ASME B31.3 (Process Piping), API 579 (Fitness-for-Service), PSSR 2000 (UK Written Scheme of Examination)
**Client context:** Bureau Veritas Oil & Gas, UK petrochemical sites (Grangemouth, Fawley, Lindsey). ~450 CMLs per site, carbon steel dominant, amine and hydrocarbon service

---

## Section 1: Report Header `🟢 Regulatory`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Report number | Auto-generated | Yes | Format: [TIC body prefix]-[YYYY]-[sequential] |
| Date of examination | Date | Yes | When inspector was physically on-site |
| Date of report | Date | Yes | When report issued |
| Client name | Text | Yes | Legal entity commissioning the inspection |
| Site/plant name | Text | Yes | Physical location (e.g., Grangemouth Processing Complex) |
| Site address | Text | Yes | Full address |
| Pipeline/circuit ID | Text | Yes | Client's piping circuit identifier (e.g., PC-2401) |
| Line number | Text | Yes | P&ID line number (e.g., 6"-HC-2401-A1A-HT) |
| Service description | Text | Yes | Fluid service (e.g., Lean Amine, Rich Amine, Crude Oil) |
| Pipe specification | Text | Yes | Material, schedule, diameter (e.g., 6" Sch.40, A106 Gr.B) |
| Design code | Dropdown | Yes | Options: ASME B31.3, ASME B31.1, EN 13480, PD 8010 |
| Design pressure (bar) | Number | Yes | |
| Design temperature (°C) | Number | Yes | |
| Operating pressure (bar) | Number | Yes | |
| Operating temperature (°C) | Number | Yes | |
| Material of construction | Text | Yes | e.g., A106 Gr.B, A335 P11, A312 TP316L |
| Year of installation | Number | Yes | |
| Insulation type | Dropdown | Yes | Options: None, Calcium silicate, Mineral wool, Cellular glass, Polyurethane foam |
| Inspector name | Text | Yes | |
| Inspector qualification | Text | Yes | e.g., API 570 Certified, Certificate #XXXXX |
| Examination type | Dropdown | Yes | Options: On-Stream, Shutdown, External only |
| WSE reference | Text | Conditional | Required if PSSR applies (UK) |
| Previous report reference | Text | Yes | Links to last examination for trending |

---

## Section 2: Scope and Limitations `🟢 Regulatory`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Circuit description | Free text | Yes | Brief description of the piping circuit (from/to, function) |
| Areas examined | Multi-select + free text | Yes | CML locations, bends, dead legs, supports, flanges, valves |
| Areas NOT examined | Multi-select + free text | Conditional | If any exclusions — state why (insulated, inaccessible, in-service restriction) |
| Examination limitations | Free text | Conditional | e.g., "On-stream inspection — internal visual not possible" |
| Access method | Dropdown | Yes | Options: At-grade, Scaffold, Rope access, Cherry picker, Remote (crawler) |
| Insulation removed | Boolean | Yes | If yes, extent of removal |
| Insulation removal extent | Free text | Conditional | e.g., "CUI suspect locations only — 8 locations stripped" |
| Surface preparation | Dropdown | Yes | Options: As-found, Wire-brushed, Grit-blasted, Power tool cleaned |

---

## Section 3: Methodology `🟡 Industry Standard` | NDT methodology not confirmed with client lab

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Visual examination | Boolean | Yes | External visual always performed |
| Ultrasonic thickness | Boolean | Yes | Primary quantitative method for piping |
| UT instrument | Text | Conditional | Make, model, serial number, calibration date |
| UT probe | Text | Conditional | Type, frequency, diameter |
| Calibration block | Text | Conditional | Type, thickness, material |
| Radiographic testing | Boolean | No | For inaccessible locations or weld inspection |
| RT details | Free text | Conditional | Source, isotope/kV, film type, procedure ref |
| Additional NDT methods | Multi-select | No | Options: MPI, DPT, PAUT, TOFD, Guided Wave, Long Range UT, Pulsed Eddy Current |
| Additional NDT details | Free text | Conditional | Instrument details, procedure references |
| Reference procedures | Text | Yes | Internal work instruction / procedure numbers |

---

## Section 4: Thickness Survey (CML Readings) `🟢 Regulatory`

This is the core quantitative section. One row per Condition Monitoring Location (CML).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| CML ID | Text | Yes | Unique location identifier (e.g., CML-001, CML-002) |
| CML description | Text | Yes | Physical description (e.g., "6 o'clock, downstream of elbow E-03") |
| Component type | Dropdown | Yes | Options: Straight run, Elbow, Tee, Reducer, Dead leg, Branch connection, Valve body |
| Nominal thickness (mm) | Number | Yes | Original design/schedule thickness |
| Previous reading (mm) | Number | Conditional | From last examination. Blank if first reading |
| Previous reading date | Date | Conditional | |
| Current reading (mm) | Number | Yes | Today's measurement |
| Minimum required thickness (mm) | Number | Yes | From ASME B31.3 / design code calculations (t_min) |
| Short-term corrosion rate (mm/yr) | Calculated | Auto | (Previous − Current) ÷ years between readings |
| Long-term corrosion rate (mm/yr) | Calculated | Auto | (Nominal − Current) ÷ years in service |
| Remaining life (years) | Calculated | Auto | (Current − Minimum required) ÷ max(ST rate, LT rate) |
| Status | Auto-classified | Auto | Green (>10yr), Amber (5-10yr), Red (2-5yr), Critical (<2yr) `🟡 Industry Standard` |

**Anomaly detection triggers:** `🟡 Industry Standard`

- Short-term rate >2× long-term rate → flag for investigation
- Current reading > previous reading → physically impossible, flag calibration/location error
- Remaining life < next inspection interval → flag for immediate attention
- CML at injection point with rate >2× circuit average → flag injection point corrosion

---

## Section 5: Visual / External Findings `🟡 Industry Standard` | Finding categories not validated against client's defect library

One entry per finding. Findings linked to photographs and CML data where relevant.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Finding ID | Auto-generated | Yes | Sequential within report (F-001, F-002, etc.) |
| Location | Text | Yes | Specific location on piping circuit (component, position, P&ID reference) |
| Finding type | Dropdown | Yes | Options: General corrosion, Localised pitting, CUI, Erosion, Cracking, Mechanical damage, Support failure, Coating failure, Flange leak, Injection point corrosion, Other |
| Description | Free text | Yes | Factual description of what was observed |
| Severity | Dropdown | Yes | Options: Acceptable (monitor), Requires action (specify timeframe), Requires immediate action, Requires engineering assessment |
| Dimensions | Text | Conditional | Length × width × depth in mm |
| Photograph reference | Photo attachment | Yes | At least one photo per finding |
| Acceptance criteria | Text | Yes | Which code clause/requirement applies |
| Recommendation | Free text | Yes | Specific action required |
| Timeframe | Dropdown | Yes | Options: Before return to service, Within 30 days, Before next examination, Advisory |
| NDT follow-up required | Boolean | No | |
| NDT method recommended | Dropdown | Conditional | If follow-up = yes |

---

## Section 6: Corrosion Under Insulation (CUI) Assessment `🟡 Industry Standard` | CUI criteria based on generic API guidance, not client thresholds

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| CUI assessment performed | Boolean | Yes | |
| Locations inspected | Number | Conditional | Number of locations where insulation was removed |
| CUI found | Boolean | Conditional | |
| CUI severity | Dropdown | Conditional | Options: None, Light surface rust, Moderate (measurable wall loss), Severe (significant wall loss), Through-wall |
| Affected area description | Free text | Conditional | Location, extent, surface condition under insulation |
| Wall loss at CUI location (mm) | Number | Conditional | UT reading at CUI location vs nominal |
| Insulation condition | Dropdown | Conditional | Options: Good, Damaged (localised), Damaged (widespread), Missing, Waterlogged |
| Jacketing condition | Dropdown | Conditional | Options: Good, Damaged, Missing, Corroded |
| Sealant condition | Dropdown | Conditional | Options: Good, Cracked, Missing |
| Photograph reference | Photo attachment | Conditional | |
| Recommendation | Free text | Conditional | Repair, re-insulate, monitor, strip entirely |

---

## Section 7: Injection Point Assessment `🟢 Regulatory`

Per API 570 Section 7.1.5 — injection points require specific assessment.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Injection point present | Boolean | Yes | |
| Injection type | Dropdown | Conditional | Options: Chemical injection, Water wash, Caustic, Inhibitor, Neutraliser |
| Injection chemical | Text | Conditional | What is being injected |
| Downstream inspection extent | Text | Conditional | How far downstream from injection point was inspected (per API 570: minimum 12" or 3× pipe diameter) |
| Corrosion pattern | Dropdown | Conditional | Options: None detected, General thinning, Localised pitting, Grooving, Impingement |
| CML readings at injection point | Text | Conditional | Reference CML IDs taken at or near injection point |
| Recommendation | Free text | Conditional | |

---

## Section 8: Safety Systems `🟢 Regulatory`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Device type | Dropdown | Yes | Options: Pressure relief valve (PRV), Bursting disc, Safety interlock, Emergency isolation valve (EIV) |
| Device ID / tag | Text | Yes | |
| Set pressure (bar) | Number | Conditional | For PRVs |
| Last test date | Date | Yes | |
| Test result | Dropdown | Yes | Options: Satisfactory, Requires attention, Failed |
| Notes | Free text | No | |

---

## Section 9: Fitness-for-Service Assessment `🟢 Regulatory`

Only required if defects found that bring the piping outside original design parameters.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| FFS required | Boolean | Yes | |
| Assessment method | Dropdown | Conditional | Options: API 579 Level 1, API 579 Level 2, API 579 Level 3, BS 7910 |
| Defect type assessed | Text | Conditional | Reference to Finding ID |
| Result | Dropdown | Conditional | Options: Fit for continued service, Fit with conditions, Not fit — repair required, Not fit — replace |
| Conditions for continued service | Free text | Conditional | e.g., reduced operating pressure, monitoring frequency, operational restrictions |
| Assessment reference | Text | Conditional | Calculation report number |

---

## Section 10: Conclusions & Recommendations `🟡 Industry Standard` | Conclusion format not confirmed with client QA

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Overall condition | Dropdown | Yes | Options: Satisfactory, Satisfactory with observations, Requires action before continued service, Not fit for continued service |
| Safe to continue in service | Boolean | Yes | **Legally significant declaration** |
| Conditions for continued service | Free text | Conditional | If any restrictions |
| Statutory report raised | Boolean | Conditional | If PSSR applies |
| Summary of critical findings | Free text | Yes | Brief narrative of key findings |
| Next examination type | Dropdown | Yes | Options: On-Stream, Shutdown, External only |
| Next examination date | Date | Yes | Based on remaining life calculation and API 570 interval rules |
| Recommended examination interval justification | Free text | Yes | Why this interval was chosen (per API 570 RBI methodology) |

---

## Section 11: Declarations `🟢 Regulatory`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Competent person declaration | Checkbox | Yes | "I am a competent person within the meaning of..." |
| Accreditation statement | Text | Yes | UKAS / ILAC accreditation reference |
| Independence declaration | Checkbox | Yes | Confirmation of impartiality |
| Inspector signature | Signature | Yes | Wet or electronic |
| Date signed | Date | Yes | |
| Technical reviewer | Text | Conditional | If peer review required |
| Reviewer signature | Signature | Conditional | |

---

## Appendices Checklist `🟡 Industry Standard` | Appendix requirements not confirmed with client document control

| Appendix | Required | Notes |
|----------|----------|-------|
| Photographs | Yes | Labelled with Finding IDs |
| CML location diagram / isometric | Yes | Sketch or isometric showing all CML locations on circuit |
| P&ID markup | Yes | Marked-up P&ID showing inspection extent |
| Corrosion mapping | Conditional | If PAUT/grid scanning performed |
| NDT reports/certificates | Conditional | Full reports for each additional NDT method used |
| Calibration certificates | Yes | For all instruments used |
| Previous report data | Yes | For trending comparison |
| FFS calculation summary | Conditional | If FFS assessment performed |

---

## Template Configuration Notes `🟠 Inferred` | Workflow sequence assumed from general pipeline practice

### Sequence

This template follows the pipeline inspector's natural workflow:

1. Header data pre-populated from asset register and P&ID (circuit ID, line number, service, spec)
2. Scope confirmed on arrival — which CMLs, which components, insulation removal plan
3. External visual first (before scaffold/access setup)
4. CML readings taken at each monitoring location
5. CUI locations inspected where insulation removed
6. Injection points assessed (API 570 mandatory)
7. Safety devices checked
8. Findings compiled with photos
9. FFS assessment if needed
10. Conclusions and declarations last

### Automation Opportunities

- **Pre-populate** from asset register: circuit data, CML locations, previous readings, design parameters
- **Auto-calculate** corrosion rates and remaining life from CML readings
- **Auto-classify** remaining life status (green/amber/red/critical)
- **Auto-flag** anomalies (impossible readings, rate acceleration, injection point patterns, interval breaches)
- **Auto-generate** conclusions narrative from findings data
- **Auto-determine** next examination date from API 570 RBI methodology
- **Auto-link** CUI assessment to nearest CML readings for correlation

### Validation Rules

- Current reading must be ≤ nominal thickness (unless different material or repaired)
- If any finding severity = "Requires immediate action", overall condition cannot be "Satisfactory"
- If safe to continue = No, conditions for continued service field becomes mandatory
- Next examination date must be ≤ half remaining life per API 570
- At least one photograph required per visual finding
- Injection point assessment is mandatory if injection points exist on the circuit (API 570 Section 7.1.5)
- CUI assessment mandatory if piping is insulated and operating between -12°C and 175°C (API 570 CUI temperature range)

### Differences from Pressure Vessel (API 510)

- **CMLs replace TMLs** — terminology and data model differ (Condition vs Thickness Monitoring Locations)
- **CUI section added** — pipeline-specific concern, not typical for pressure vessels
- **Injection point section added** — API 570 mandatory requirement, not in API 510
- **Circuit-based** not equipment-based — a single pipeline report covers a circuit, not a single asset
- **Operating conditions captured** — API 570 requires both design AND operating pressure/temperature
- **P&ID reference** — piping identified by line number, not vessel tag
