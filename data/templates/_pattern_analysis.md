# Pattern Analysis
# Generated: 2026-03-04

---

## Overlap Map

| Pattern | Templates | Match Level |
|---------|-----------|-------------|
| Report Header (core 14 fields) | Pressure Vessel API 510, Pipeline API 570 | Similar (14/21 fields identical) |
| Scope & Limitations | Pressure Vessel API 510, Pipeline API 570 | Similar (6/8 fields identical) |
| Methodology | Pressure Vessel API 510, Pipeline API 570 | Similar (8/10 fields identical) |
| Thickness Survey structure (TML/CML) | Pressure Vessel API 510, Pipeline API 570 | Similar (10/12 fields identical) |
| Visual Findings table (12 fields) | Pressure Vessel API 510, Pipeline API 570 | Near-Identical (structure identical, dropdown options differ) |
| Safety Devices/Systems (6 fields) | Pressure Vessel API 510, Pipeline API 570 | Near-Identical (device type options differ) |
| FFS Assessment (6 fields) | Pressure Vessel API 510, Pipeline API 570 | Identical |
| Conclusions (8 fields) | Pressure Vessel API 510, Pipeline API 570 | Near-Identical (exam type options differ) |
| Declarations (7 fields) | Pressure Vessel API 510, Pipeline API 570 | Identical |
| Appendices Checklist | Pressure Vessel API 510, Pipeline API 570 | Similar (6/8 items shared) |
| RAG remaining life classification | Pressure Vessel API 510, Pipeline API 570 | Identical (same thresholds) |
| Severity scale (4-tier) | Pressure Vessel API 510, Pipeline API 570 | Identical |
| Anomaly detection rules (3 core) | Pressure Vessel API 510, Pipeline API 570 | Identical |
| Validation rules (5 core) | Pressure Vessel API 510, Pipeline API 570 | Identical |
| Corrosion rate + remaining life formulas | Pressure Vessel API 510, Pipeline API 570 | Identical |

## Reusable Elements

| Element | Count | Templates |
|---------|-------|-----------|
| Universal header fields (report #, dates, client, site, inspector, standard, previous ref) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Scope & limitations block (areas examined/excluded, limitations, access, surface prep) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Methodology block (visual, UT instrument suite, additional NDT, procedures) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Thickness monitoring engine (readings, corrosion rates, remaining life, RAG status) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Visual findings table (ID, location, type, description, severity, photo, recommendation) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| FFS assessment block (6 identical fields) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Conclusions block (overall condition, safe to continue, statutory, next exam) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Declarations block (competent person, accreditation, independence, signatures) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Safety devices block (device type, ID, set pressure, test date, result) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Appendices structure (photos, location diagrams, NDT reports, calibration certs) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Anomaly detection engine (3 core rules) | 2 | Pressure Vessel API 510, Pipeline API 570 |
| Validation rules engine (5 core rules) | 2 | Pressure Vessel API 510, Pipeline API 570 |

## Scalability Signals

| Template | Reusable % | Bespoke Fields |
|----------|-----------|----------------|
| Pressure Vessel (API 510) | 93% | 7 fields unique (vessel tag, serial #, year of manufacture, MAWP, confined space entry, vessel-specific identifiers) |
| Pipeline (API 570) | 76% | 24 fields unique (CUI assessment: 10, injection point: 7, operating P&T: 2, pipe spec fields: 3, component type: 1, P&ID appendix: 1) |

### Summary

- **Total unique fields across library:** 128
- **Fields appearing in 2+ templates:** 97 (75.8%)
- **Truly unique fields:** 31 (24.2%)
- **Repeatable core:** ~76%
- **Bespoke layer:** ~24%

The bespoke layer is concentrated in two areas: (1) domain-specific assessment sections (CUI, injection points) that are standard-mandated additions, and (2) asset identification fields that differ between equipment-based and circuit-based inspection types. The core inspection workflow — capture, measure, classify, conclude, declare — is universal.
