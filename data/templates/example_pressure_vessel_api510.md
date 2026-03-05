# Template Spec: Pressure Vessel Inspection (API 510)

# Type: Example — Tool-Agnostic Reference Pattern

# Created: 2026-03-02

# Status: Complete (Layer 1)

---

## Confidence Legend

Each section is tagged with a confidence level indicating how its requirements were derived:

| Tag | Meaning | Source | Expected Client Adjustment |
|-----|---------|--------|---------------------------|
| `🟢 Regulatory` | Verified against published standard | API 510, ASME VIII, PSSR 2000, or other cited regulation | Minimal — mandated by regulation |
| `🟡 Industry Standard` | Common TIC practice, high confidence | Widely adopted across enterprise TIC companies | Low — may vary in format but substance is consistent |
| `🟠 Inferred` | Reasonable assumption based on domain knowledge | Derived from report anatomy, inspection type patterns, or general best practice | Moderate to high — expect client-specific adjustment on Friday |

Sections tagged `🟠 Inferred` carry a subtle indicator in generated reports so viewers know which parts may need client-specific validation.

---

## Overview

This is a reference template spec for a pressure vessel in-service inspection per API 510. It is **tool-agnostic** — it defines what data must be captured, in what structure, with what classification system. Once Layer 2 (Scope's tool mechanics) is captured via `/Tool_Setup`, this spec maps onto the actual product configuration.

**Inspection type:** Pressure Vessel — In-Service Condition Assessment
**Primary standard:** API 510
**Supporting standards:** PSSR 2000 (UK WSE requirement), API 579 (fitness-for-service), ASME BPVC VIII (design reference)
**Typical client context:** Enterprise TIC, oil & gas / petrochemical / power generation clients

---

## Section 1: Report Header `🟢 Regulatory` | No changes expected — fields are mandated by API 510 Section 6


| Field                     | Type           | Required    | Notes                                                                 |
| ------------------------- | -------------- | ----------- | --------------------------------------------------------------------- |
| Report number             | Auto-generated | Yes         | Format: [TIC body prefix]-[YYYY]-[sequential]                         |
| Date of examination       | Date           | Yes         | When inspector was physically on-site                                 |
| Date of report            | Date           | Yes         | When report issued. Track gap — regulatory compliance metric          |
| Client name               | Text           | Yes         | Legal entity commissioning the inspection                             |
| Site/plant name           | Text           | Yes         | Physical location                                                     |
| Site address              | Text           | Yes         | Full address                                                          |
| Vessel tag number         | Text           | Yes         | Client's asset identifier                                             |
| Vessel serial number      | Text           | Yes         | Manufacturer's serial                                                 |
| Equipment description     | Text           | Yes         | Type (column, exchanger, drum, reactor), make, model, capacity        |
| Year of manufacture       | Number         | Yes         |                                                                       |
| Design code               | Dropdown       | Yes         | Options: ASME VIII Div.1, ASME VIII Div.2, EN 13445, PD 5500, BS 5500 |
| MAWP (bar)                | Number         | Yes         | Maximum Allowable Working Pressure                                    |
| Design temperature (°C)   | Number         | Yes         |                                                                       |
| Material of construction  | Text           | Yes         | e.g., SA-516 Gr.70, SA-240 Type 304                                   |
| Inspector name            | Text           | Yes         |                                                                       |
| Inspector qualification   | Text           | Yes         | e.g., API 510 Certified, Certificate #XXXXX                           |
| Examination type          | Dropdown       | Yes         | Options: Internal, External, On-Stream, Combined                      |
| WSE reference             | Text           | Conditional | Required if PSSR applies (UK)                                         |
| Previous report reference | Text           | Yes         | Links to last examination for trending                                |


---

## Section 2: Scope and Limitations `🟢 Regulatory` | No changes expected — scope documentation required by API 510


| Field                   | Type                     | Required    | Notes                                                                      |
| ----------------------- | ------------------------ | ----------- | -------------------------------------------------------------------------- |
| Areas examined          | Multi-select + free text | Yes         | Shell courses, heads, nozzles, internals, supports, nameplate              |
| Areas NOT examined      | Multi-select + free text | Conditional | If any exclusions — state why (inaccessible, lagged, client restriction)   |
| Examination limitations | Free text                | Conditional | e.g., "Vessel not gas-freed — internal visual limited to video inspection" |
| Access method           | Dropdown                 | Yes         | Options: Scaffold, manway entry, remote (borescope), external only         |
| Confined space entry    | Boolean                  | Yes         | If yes, permit reference required                                          |
| Surface preparation     | Dropdown                 | Yes         | Options: As-found, wire-brushed, grit-blasted, chemical-cleaned            |


---

## Section 3: Methodology `🟡 Industry Standard` | Confirm client's preferred NDT method listing format — field order may vary


| Field                  | Type         | Required    | Notes                                                               |
| ---------------------- | ------------ | ----------- | ------------------------------------------------------------------- |
| Visual examination     | Boolean      | Yes         | Almost always yes                                                   |
| Ultrasonic thickness   | Boolean      | Yes         | Primary quantitative method                                         |
| UT instrument          | Text         | Conditional | Make, model, serial number, calibration date                        |
| UT probe               | Text         | Conditional | Type, frequency, diameter                                           |
| Calibration block      | Text         | Conditional | Type, thickness, material                                           |
| Additional NDT methods | Multi-select | No          | Options: MPI, DPT, PAUT, TOFD, Radiography, Hardness testing        |
| Additional NDT details | Free text    | Conditional | Instrument details, procedure references for each additional method |
| Reference procedures   | Text         | Yes         | Internal work instruction / procedure numbers                       |


---

## Section 4: Thickness Survey `🟢 Regulatory` | No changes expected — TML measurement fields mandated by API 510 Section 7

This is the core quantitative section. One row per Thickness Monitoring Location (TML).


| Field                             | Type            | Required    | Notes                                                                                 |
| --------------------------------- | --------------- | ----------- | ------------------------------------------------------------------------------------- |
| TML ID                            | Text            | Yes         | Unique location identifier (e.g., Shell-1, Head-N, Nozzle-A)                          |
| TML description                   | Text            | Yes         | Physical description (e.g., "Lower shell course, 6 o'clock, 300mm above bottom weld") |
| Nominal thickness (mm)            | Number          | Yes         | Original design thickness                                                             |
| Previous reading (mm)             | Number          | Conditional | From last examination. Blank if first reading                                         |
| Previous reading date             | Date            | Conditional |                                                                                       |
| Current reading (mm)              | Number          | Yes         | Today's measurement                                                                   |
| Minimum required thickness (mm)   | Number          | Yes         | From design code calculations                                                         |
| Short-term corrosion rate (mm/yr) | Calculated      | Auto        | (Previous − Current) ÷ years between readings                                         |
| Long-term corrosion rate (mm/yr)  | Calculated      | Auto        | (Nominal − Current) ÷ years in service                                                |
| Remaining life (years)            | Calculated      | Auto        | (Current − Minimum required) ÷ corrosion rate                                         |
| Status                            | Auto-classified | Auto        | Green (>10yr), Amber (5-10yr), Red (<5yr), Critical (<2yr) `🟡 Industry Standard — thresholds are common practice, not API 510 prescribed` |


**Anomaly detection triggers:** `🟡 Industry Standard`

- Short-term rate >2× long-term rate → flag for investigation
- Current reading > previous reading → physically impossible, flag calibration/location error
- Remaining life < next inspection interval → flag for immediate attention

---

## Section 5: Visual Findings `🟡 Industry Standard` | Check if client uses finding-per-row or grouped format — photo linkage method may differ

One entry per finding. Findings linked to photographs and measurement data.


| Field                  | Type             | Required    | Notes                                                                                                                                       |
| ---------------------- | ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Finding ID             | Auto-generated   | Yes         | Sequential within report (F-001, F-002, etc.)                                                                                               |
| Location               | Text             | Yes         | Specific location on vessel (component, position, elevation)                                                                                |
| Finding type           | Dropdown         | Yes         | Options: General corrosion, Localised pitting, Cracking, Erosion, Mechanical damage, Weld defect, Lining failure, Bulging/distortion, Other |
| Description            | Free text        | Yes         | Factual description of what was observed. Specific dimensions, extent, severity                                                             |
| Severity               | Dropdown         | Yes         | Options: Acceptable (monitor), Requires action (specify timeframe), Requires immediate action, Requires engineering assessment              |
| Dimensions             | Text             | Conditional | Length × width × depth in mm                                                                                                                |
| Photograph reference   | Photo attachment | Yes         | At least one photo per finding                                                                                                              |
| Acceptance criteria    | Text             | Yes         | Which code clause/requirement applies                                                                                                       |
| Recommendation         | Free text        | Yes         | Specific action required                                                                                                                    |
| Timeframe              | Dropdown         | Yes         | Options: Before return to service, Within 30 days, Before next examination, Advisory                                                        |
| NDT follow-up required | Boolean          | No          | If additional testing needed                                                                                                                |
| NDT method recommended | Dropdown         | Conditional | If follow-up = yes                                                                                                                          |


---

## Section 6: Safety Devices `🟢 Regulatory` | No changes expected — safety device records required by PSSR 2000 and API 510


| Field              | Type      | Required    | Notes                                                                                                 |
| ------------------ | --------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| Device type        | Dropdown  | Yes         | Options: Pressure relief valve (PRV), Bursting disc, Safety interlock, Level alarm, Temperature alarm |
| Device ID / tag    | Text      | Yes         |                                                                                                       |
| Set pressure (bar) | Number    | Conditional | For PRVs                                                                                              |
| Last test date     | Date      | Yes         |                                                                                                       |
| Test result        | Dropdown  | Yes         | Options: Satisfactory, Requires attention, Failed                                                     |
| Notes              | Free text | No          |                                                                                                       |


---

## Section 7: Fitness-for-Service Assessment `🟢 Regulatory` | No changes expected — FFS fields mandated by API 579

Only required if defects found that bring the vessel outside original design parameters.


| Field                            | Type      | Required    | Notes                                                                                                 |
| -------------------------------- | --------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| FFS required                     | Boolean   | Yes         |                                                                                                       |
| Assessment method                | Dropdown  | Conditional | Options: API 579 Level 1, API 579 Level 2, API 579 Level 3, BS 7910                                   |
| Defect type assessed             | Text      | Conditional | Reference to Finding ID                                                                               |
| Result                           | Dropdown  | Conditional | Options: Fit for continued service, Fit with conditions, Not fit — repair required, Not fit — replace |
| Conditions for continued service | Free text | Conditional | e.g., reduced MAWP, monitoring frequency, operational restrictions                                    |
| Assessment reference             | Text      | Conditional | Calculation report number                                                                             |


---

## Section 8: Conclusions `🟡 Industry Standard` | Verify client's conclusion format — some require separate recommendation vs conclusion fields


| Field                                          | Type      | Required    | Notes                                                                                                                          |
| ---------------------------------------------- | --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Overall condition                              | Dropdown  | Yes         | Options: Satisfactory, Satisfactory with observations, Requires action before continued service, Not fit for continued service |
| Safe to continue in service                    | Boolean   | Yes         | **Legally significant declaration**                                                                                            |
| Conditions for continued service               | Free text | Conditional | If any restrictions                                                                                                            |
| Statutory report raised                        | Boolean   | Conditional | If PSSR applies                                                                                                                |
| Summary of critical findings                   | Free text | Yes         | Brief narrative of key findings                                                                                                |
| Next examination type                          | Dropdown  | Yes         | Options: Internal, External, On-Stream                                                                                         |
| Next examination date                          | Date      | Yes         | Based on remaining life calculation and API 510 interval rules                                                                 |
| Recommended examination interval justification | Free text | Yes         | Why this interval was chosen                                                                                                   |


---

## Section 9: Declarations `🟢 Regulatory` | No changes expected — competent person declaration required by law


| Field                        | Type      | Required    | Notes                                              |
| ---------------------------- | --------- | ----------- | -------------------------------------------------- |
| Competent person declaration | Checkbox  | Yes         | "I am a competent person within the meaning of..." |
| Accreditation statement      | Text      | Yes         | UKAS / ILAC accreditation reference                |
| Independence declaration     | Checkbox  | Yes         | Confirmation of impartiality                       |
| Inspector signature          | Signature | Yes         | Wet or electronic                                  |
| Date signed                  | Date      | Yes         |                                                    |
| Technical reviewer           | Text      | Conditional | If peer review required                            |
| Reviewer signature           | Signature | Conditional |                                                    |


---

## Appendices Checklist `🟡 Industry Standard` | Confirm which supporting documents client requires — list may need additions or removals


| Appendix                 | Required    | Notes                                            |
| ------------------------ | ----------- | ------------------------------------------------ |
| Photographs              | Yes         | Labelled with Finding IDs                        |
| TML location diagram     | Yes         | Sketch/drawing showing all measurement locations |
| Corrosion mapping        | Conditional | If PAUT/grid scanning performed                  |
| NDT reports/certificates | Conditional | Full reports for each additional NDT method used |
| Calibration certificates | Yes         | For all instruments used                         |
| Previous report data     | Yes         | For trending comparison                          |
| FFS calculation summary  | Conditional | If FFS assessment performed                      |


---

## Template Configuration Notes `🟠 Inferred` | Validate entire workflow sequence and automation mapping against client's actual process on Friday

### Sequence

This template follows the inspector's natural workflow:

1. Header data captured before arriving on-site (pre-populated from asset register)
2. Scope/limitations confirmed on arrival
3. External visual first (before access setup)
4. Internal visual and thickness survey (main examination)
5. Safety devices checked
6. Findings compiled
7. FFS assessment if needed
8. Conclusions and declarations last

### Automation Opportunities

- **Pre-populate** from asset register: vessel data, previous readings, design parameters
- **Auto-calculate** corrosion rates and remaining life from thickness readings
- **Auto-classify** remaining life status (green/amber/red/critical)
- **Auto-flag** anomalies (impossible readings, rate acceleration, interval breaches)
- **Auto-generate** conclusions narrative from findings data
- **Auto-determine** next examination date from API 510 interval rules

### Validation Rules

- Current reading must be ≤ nominal thickness (unless different material or repaired)
- If any finding severity = "Requires immediate action", overall condition cannot be "Satisfactory"
- If safe to continue = No, conditions for continued service field becomes mandatory
- Next examination date must be ≤ half remaining life and ≤ 10 years per API 510
- At least one photograph required per visual finding

