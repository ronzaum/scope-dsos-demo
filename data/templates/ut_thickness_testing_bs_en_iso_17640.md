# Template Spec: UT Thickness Testing (BS EN ISO 17640)

# Type: Applus+ UK — NDT Storage Tank Inspection
# Created: 2026-03-06
# Status: QA'd (Layer 1 + Layer 2)
# Client Context: Applus+ UK, INEOS Grangemouth, NDT storage tanks & piping
# Reference Report: L5-NDT-UTT-F01 Rev 1 — Scott Lindsay, Report #0143, Tank T-204

---

## Confidence Legend

| Tag | Meaning | Source | Expected Client Adjustment |
|-----|---------|--------|---------------------------|
| `Regulatory` | Verified against published standard | BS EN ISO 17640, API 653, EEMUA 159, PSSR 2000 | Minimal — mandated by regulation |
| `Industry Standard` | Common TIC practice, high confidence | Widely adopted across enterprise TIC companies | Low — format may vary |
| `Inferred` | Reasonable assumption based on domain knowledge | Derived from Scott's example report + interview context | Moderate — validated against L5-NDT-UTT-F01 |
| `Client Specific` | Mapped directly from Applus+ existing report | L5-NDT-UTT-F01 Rev 1 format and field ordering | None — must match exactly per Jon's requirement |

---

## Overview

UT thickness testing template for above-ground storage tank inspections. Designed to replicate Applus+ UK's existing L5-NDT-UTT-F01 Rev 1 format while adding Scope's automation layer underneath.

**Inspection type:** NDT — Ultrasonic Thickness Testing (Storage Tanks)
**Primary standard:** BS EN ISO 17640 (UT testing of welds), API 653 (tank inspection)
**Supporting standards:** EEMUA 159 (tank maintenance), PSSR 2000 (UK), BS EN ISO 16809 (UT thickness measurement)
**Client context:** Applus+ UK — INEOS Grangemouth. Scott Lindsay workflow. 3-page report format.
**Critical constraint:** Output format must match L5-NDT-UTT-F01 exactly. End clients (INEOS) parse Applus reports into internal systems — format changes break their integrations. (Jon Webster, non-negotiable)

**Baseline time (current):** ~180 minutes per report (Scott's estimate: ~3 hours in Word)
**Target time (with Scope):** <30 minutes per report

---

## Section 1: Report Header `Client Specific` | Must match L5-NDT-UTT-F01 header block exactly

This header maps directly from Scott's example report. Field order is locked to match existing client expectations.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Report number | Auto-generated | Yes | Format: 4-digit sequential (e.g., 0143). Applus numbering scheme |
| Document reference | Text (locked) | Yes | L5-NDT-UTT-F01 Rev 1 — appears in footer of every page |
| Client name | Text | Yes | e.g., INEOS Grangemouth |
| Client PO number | Text | Yes | e.g., PO-4852 |
| Site / location | Text | Yes | Physical site name |
| Equipment ID | Text | Yes | Tank tag number (e.g., T-204) |
| Equipment description | Text | Yes | e.g., "Storage Tank T-204" |
| Job description | Free text | Yes | e.g., "External and internal inspection with UT thickness readings of the floor plates" |
| Date of inspection | Date | Yes | When inspector was on site |
| Date of report | Date | Yes | When report issued |
| Inspector name | Text | Yes | e.g., Scott Lindsay |
| Inspector qualification | Text | Yes | PCN Level 2 UT, CSWIP, etc. |
| Applus office | Text (locked) | Yes | Unit 2, Blocks C & D, West Mains Industrial Estate, Falkirk, FK3 8YE |

---

## Section 2: Findings Narrative `Client Specific` | Free-text format matching Scott's existing structure

This is the core of Scott's report — a structured narrative covering all examination findings. In Scott's current workflow, this is where most of the 3-hour report time goes: reconstructing field notes into coherent technical prose.

### Subsection 2a: External Visual Examination

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| External visual summary | Free text (structured) | Yes | Coating condition, surface corrosion, structural observations |
| Coating condition | Dropdown | Yes | Options: Good, Localised breakdown, General deterioration, Requires recoating |
| Coating breakdown locations | Free text | Conditional | Clock positions, shell courses affected |
| Surface corrosion | Dropdown | Yes | Options: None, Light surface staining, Moderate, Significant, Severe |
| Pitting observed (external) | Boolean | Yes | |
| Pitting details | Free text | Conditional | Location, density, max depth if measurable |

### Subsection 2b: Shell-to-Bottom Weld

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Shell-to-bottom weld condition | Free text | Yes | Staining, undercut, active leakage status |
| Active leakage | Boolean | Yes | Critical safety indicator |
| Weld defects noted | Free text | Conditional | Type, location, extent |

### Subsection 2c: Settlement / Foundation

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Settlement survey performed | Boolean | Yes | |
| Max differential settlement (mm) | Number | Conditional | |
| Settlement within tolerance | Boolean | Conditional | |
| Settlement trending | Dropdown | Conditional | Options: Stable, Increasing, Decreasing, New reading |
| Settlement datum notes | Free text | Conditional | e.g., "trending upward at datum 7" |

### Subsection 2d: Internal Visual Examination

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Internal visual summary | Free text | Yes | Floor plate condition, shell condition from inside |
| Floor plate condition | Dropdown | Yes | Options: Good, Isolated pitting, Widespread pitting, Significant wastage |
| Pitting location pattern | Free text | Conditional | e.g., "within 500mm of shell", "near product inlet" |
| Worst area description | Free text | Conditional | |

### Subsection 2e: UT Thickness Measurements

Repeating section — one row per measurement location.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Location ID | Text | Yes | e.g., FP-01, SC-01, HC-01 |
| Component | Dropdown | Yes | Options: Floor plate, Shell course 1, Shell course 2, Shell course 3, Shell course 4, Head, Nozzle, Manway |
| Location description | Text | Yes | e.g., "Floor plate, 500mm from shell at 3 o'clock" |
| Nominal thickness (mm) | Number | Yes | Original design/as-built thickness |
| Previous reading (mm) | Number | Conditional | From last examination |
| Previous reading date | Date | Conditional | |
| Current reading (mm) | Number | Yes | Today's measurement |
| Minimum required thickness (mm) | Number | Yes | From design calculations |
| Wall loss (%) | Calculated | Auto | ((Nominal − Current) ÷ Nominal) × 100 |
| Short-term corrosion rate (mm/yr) | Calculated | Auto | (Previous − Current) ÷ years between readings |
| Long-term corrosion rate (mm/yr) | Calculated | Auto | (Nominal − Current) ÷ years in service |
| Remaining life (years) | Calculated | Auto | (Current − Min required) ÷ corrosion rate |
| Status | Auto-classified | Auto | Green (>10yr), Amber (5-10yr), Red (2-5yr), Critical (<2yr) |

**From Scott's example:** min 6.3mm vs nominal 9.5mm plate = 33.7% wall loss. Pit depths up to 2.0mm.

### Subsection 2f: MPI on Welds

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| MPI performed | Boolean | Yes | |
| Weld locations tested | Free text | Conditional | e.g., "nozzle and manway welds" |
| Reportable indications | Boolean | Conditional | |
| MPI findings | Free text | Conditional | Details if indications found |

### Subsection 2g: Overall Assessment

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Overall condition | Dropdown | Yes | Options: Fit for continued service, Fit with conditions, Requires repair, Not fit |
| Conditions/restrictions | Free text | Conditional | e.g., "subject to local floor repairs and corrosion trend monitoring" |
| Service term | Dropdown | Yes | Options: Long-term, Medium-term, Short-to-medium term, Short-term, Immediate action required |
| Recommendations | Free text | Yes | Specific actions required |

---

## Section 3: Photographs `Client Specific` | Grid layout matching L5-NDT-UTT-F01 pages 2-3

Scott's reports have 2 pages of photo grids. Each photo has a descriptive caption. This is the section that currently takes the most time in Word — transferring from phone, pasting, resizing, captioning.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Photo | Photo attachment (context container) | Yes | Captured on mobile during inspection |
| Caption | Text | Yes | Descriptive label (e.g., "Tank plate", "Outside of tank", "Stairs", "Valves") |
| Finding reference | Text | No | Links photo to finding in Section 2 if applicable |

**Layout:** 2-up or 4-up grid per page. Captions below each photo. Matches L5-NDT-UTT-F01 photo page format.

**Scope automation:** Photos captured via mobile context containers → auto-populate into report grid. Inspector captions on-site → no manual paste/resize in Word.

---

## Section 4: Footer `Client Specific` | Appears on every page

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Document reference | Text (locked) | Yes | L5-NDT-UTT-F01 Rev 1 |
| Controlled copy warning | Text (locked) | Yes | "Uncontrolled if printed" |
| Applus address | Text (locked) | Yes | Company address block |

---

## Template Configuration Notes

### Inspector Workflow (Scope Mobile)

1. **Pre-inspection (office/vehicle):** Open report on mobile. Header fields pre-populated from asset register (tank ID, client, PO, site). Inspector confirms/edits
2. **External examination:** Walk around tank. Fill in Section 2a-2c on mobile. Take photos → auto-attach with captions
3. **Internal examination:** Enter tank. Fill in Section 2d on mobile. Take photos
4. **UT measurements:** Take readings. Enter into Section 2e repeating table on mobile. Corrosion rates and remaining life calculate automatically
5. **MPI (if applicable):** Fill in Section 2f on mobile
6. **Overall assessment:** Review auto-generated summary. Confirm/edit overall condition
7. **Submit:** Hit submit. Report auto-generates in L5-NDT-UTT-F01 format. Reviewer (supervisor) gets notification

**Time saved:** Steps 1-7 replace: write paper notes → drive to office → open Word → rewrite notes → transfer photos → paste/resize photos → format → email. Target: done before leaving site.

### Automation Opportunities

- **Pre-populate** from asset register: tank ID, client, PO, site, previous readings
- **Auto-calculate** wall loss %, corrosion rates, remaining life from UT readings
- **Auto-classify** status RAG (Green/Amber/Red/Critical) from remaining life
- **Auto-flag** anomalies: rate acceleration, impossible readings (current > previous), interval breaches
- **Auto-layout** photo grid: context containers → formatted 2-up/4-up grid with captions
- **Auto-generate** overall assessment narrative from structured findings data

### Validation Rules

- Current reading must be ≤ nominal thickness (unless weld buildup or repair noted)
- If wall loss >30%, overall condition cannot be "Fit for continued service" without conditions
- If active leakage = true, overall condition must be "Requires repair" or "Not fit"
- At least one photograph required per report (Scott's reports have 4-8 typical)
- All mandatory fields must be complete before report can be submitted for review

### Anomaly Detection

- Short-term corrosion rate >2× long-term rate → flag for investigation
- Current reading > previous reading → physically impossible, flag calibration/location error
- Remaining life < next inspection interval → flag for immediate attention
- Wall loss >50% at any single location → automatic critical flag

### Format Matching Notes

Output must replicate L5-NDT-UTT-F01 Rev 1 layout:
- **Page 1:** Header block + findings narrative (free text)
- **Page 2:** Photographs (grid with captions)
- **Page 3:** Photographs continued (grid with captions)
- **Footer:** Document ref, "Uncontrolled if printed", Applus address on every page
- **Font/styling:** Match existing Applus document standards
- **Logo:** Applus+ logo in header (configurable via Scope branding settings)

### Scope Platform Mapping (Layer 2)

| Template Section | Scope Feature | Configuration |
|-----------------|---------------|---------------|
| Header fields | Data Collection Section (Mobile + Web) | Pre-populated from asset register |
| Findings narrative | Data Collection Section (Mobile) | Structured input → auto-narrative |
| UT readings table | Data Collection Section (Mobile) | Repeating container with auto-calc |
| Photo grid | Context Containers (Mobile) | Auto-layout into report section |
| Overall assessment | Data Collection Section (Web) | Review/confirmation step |
| Report output | Report Template | L5-NDT-UTT-F01 format, PDF output |
| Review workflow | Preparer → Reviewer → Client | Three-role review process |

---

## QA Checklist (Passed 2026-03-06)

- [x] All mandatory fields from L5-NDT-UTT-F01 captured
- [x] Field types appropriate (dropdowns where standardised, free text where narrative needed)
- [x] Calculated fields have correct formulas
- [x] Anomaly detection rules defined
- [x] Validation rules prevent impossible data combinations
- [x] Photo handling mapped to Scope context containers
- [x] Output format matches existing 3-page structure
- [x] Client format sensitivity addressed (Jon's requirement)
- [x] Inspector workflow maps to mobile-first capture (Scott's workflow)
- [x] Automation opportunities identified and mapped to Scope features
- [x] Baseline time documented (180 min current → <30 min target)
