# Template Library — Index
# Last Updated: 2026-03-06

---

## Overview

Every template spec created via `/Template_Spec` is stored here. This index tracks all templates, their status, and key metadata.

---

## Templates

| # | Inspection Type | Standard | Client Context | Status | File |
|---|----------------|----------|---------------|--------|------|
| 1 | Pressure Vessel (API 510) | API 510, PSSR 2000 | Example — tool-agnostic reference | Complete | `example_pressure_vessel_api510.md` |
| 2 | Pipeline (API 570) | API 570, API 574, ASME B31.3, PSSR 2000 | Bureau Veritas — Petrochemical Division | QA'd | `pipeline_api570.md` |
| 3 | UT Thickness Testing (Storage Tanks) | BS EN ISO 17640, API 653, EEMUA 159, PSSR 2000 | Applus+ UK — INEOS Grangemouth, NDT | QA'd | `ut_thickness_testing_bs_en_iso_17640.md` |

---

## Template Status Key

| Status | Meaning |
|--------|---------|
| **Draft** | Spec created, not yet validated against tool |
| **Complete** | Spec created and validated (Layer 1 only or Layer 1 + Layer 2) |
| **QA'd** | Passed `/Template_QA` quality check |
| **Live** | Configured and deployed in Scope's tool |

---

## Patterns & Overlaps

> Populated by `/Pattern_Check`. Records reusable elements across templates.

| Pattern | First Seen In | Reused In | Confidence |
|---------|--------------|-----------|------------|
| Universal header fields (report #, dates, client, site, inspector, standard, previous ref — 14 core fields) | Template #1 | Template #2 | Medium |
| Scope & limitations block (areas examined/excluded, limitations, access method, surface prep) | Template #1 | Template #2 | Medium |
| Methodology block (visual exam, UT instrument suite, additional NDT, reference procedures) | Template #1 | Template #2 | Medium |
| Thickness monitoring engine (location ID, readings, corrosion rates, remaining life, RAG status — identical formulas) | Template #1 | Template #2 | Medium |
| Visual findings table (12 fields — ID, location, type, description, severity, photo, recommendation, timeframe) | Template #1 | Template #2 | Medium |
| FFS assessment block (6 fields — 100% identical across both templates, API 579 driven) | Template #1 | Template #2 | Medium |
| Conclusions block (overall condition, safe to continue, statutory report, next exam, interval justification) | Template #1 | Template #2 | Medium |
| Declarations block (7 fields — 100% identical, competent person, accreditation, independence, signatures) | Template #1 | Template #2 | Medium |
| Safety devices/systems section (6 fields, device type options vary slightly) | Template #1 | Template #2 | Medium |
| Anomaly detection engine (3 core rules: rate acceleration, impossible readings, interval breach) | Template #1 | Template #2 | Medium |
| Validation rules engine (5 core rules: reading bounds, severity consistency, safe-to-continue logic, interval limits, photo requirements) | Template #1 | Template #2 | Medium |
| RAG remaining life classification (Green >10yr, Amber 5-10yr, Red 2-5yr, Critical <2yr) | Template #1 | Template #2 | Medium |
| 4-tier severity scale (Acceptable → Requires action → Immediate → Engineering assessment) | Template #1 | Template #2 | Medium |

---

## Report Generation

Templates with status QA'd or Live can generate reports via `/Template_Generate` or the API:
- **Output formats:** PPTX (editable) + PDF (preview/delivery)
- **Output location:** `/data/outputs/[slug]/`
- **Frontend:** Template detail page shows Generate button, PDF preview, and download links
- **Theme:** Swappable via `api/generators/themes/` — default professional layout, Scope's theme applied on Friday

---

## Notes

- Every template spec goes in `/data/templates/` with a descriptive filename
- Index is updated every time a new template is created or status changes
- `/Pattern_Check` scans the library for overlaps and reusable elements
- `/Template_Generate` produces PPTX + PDF from any spec (QA'd recommended)
