# Template Library — Index
# Last Updated: 2026-03-02

---

## Overview

Every template spec created via `/Template_Spec` is stored here. This index tracks all templates, their status, and key metadata.

---

## Templates

| # | Inspection Type | Standard | Client Context | Status | File |
|---|----------------|----------|---------------|--------|------|
| 1 | Pressure Vessel (API 510) | API 510, PSSR 2000 | Example — tool-agnostic reference | Complete | `example_pressure_vessel_api510.md` |

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
| Universal header fields (report #, date, client, site, equipment ID, inspector) | Template #1 | All | High |
| Defect classification structure (code + description + location + recommendation) | Template #1 | TBD | Medium |
| Scope and limitations section (free-text with structured prompts) | Template #1 | TBD | Medium |

---

## Notes

- Every template spec goes in `/data/templates/` with a descriptive filename
- Index is updated every time a new template is created or status changes
- `/Pattern_Check` scans the library for overlaps and reusable elements
