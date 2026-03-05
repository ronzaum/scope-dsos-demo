# KB-022: Regulatory Standards — Add Examples to All Standards

**Type:** Improvement | **Priority:** Normal | **Effort:** Large
**Related:** FE-021 (TIC Playbook Polish)

## TL;DR

Every regulatory standard in the knowledge base (`data/knowledge/regulatory_standards.md`) needs two types of examples: a real-world inspection scenario and a sample report excerpt. Currently none of the 8 standards have either. This is a content authoring task that feeds both the knowledge base and the frontend TIC Playbook.

## Current State

- 8 standards documented: API 510, LOLER, BS 7671, ISO 17020, PED, PUWER, ISO 9001, ISO 17025
- Each has structure (intervals, classifications, report requirements) but zero worked examples
- No real-world scenarios showing how the standard plays out in practice
- No sample report excerpts showing what compliant findings look like
- Frontend TIC Playbook (FE-021) already flags this gap for display purposes

## Expected Outcome

Each of the 8 standards gets a new `### Examples` subsection containing:

### 1. Real-World Inspection Scenario
- Concrete situation (equipment, location, context)
- What was found during inspection
- How the standard's classification system applies
- What action was required and why

### 2. Example Report Excerpt
- Formatted as a realistic snippet from an actual inspection report
- Shows compliant structure per the standard's report requirements
- Includes quantitative data where the standard demands it (e.g., thickness readings for API 510, Zs values for BS 7671, uncertainty budgets for ISO 17025)
- Shows both a pass and a fail/defect finding where applicable

### Standards to cover:
1. **API 510** — pressure vessel corrosion scenario + thickness report excerpt
2. **LOLER** — crane thorough examination scenario + Schedule 1 report excerpt
3. **BS 7671** — EICR periodic inspection scenario + observation code report excerpt
4. **ISO 17020** — accreditation audit scenario + impartiality assessment excerpt
5. **PED** — new pressure equipment conformity scenario + module B examination excerpt
6. **PUWER** — work equipment inspection scenario + guarding deficiency report excerpt
7. **ISO 9001** — surveillance audit scenario + nonconformity report excerpt
8. **ISO 17025** — calibration lab scenario + uncertainty budget / test report excerpt

## Files

### Must change
- `data/knowledge/regulatory_standards.md` — add Examples subsection to all 8 standards

### May change
- `api/parsers/knowledge.js` — if parser needs to handle new example blocks
- `frontend/src/components/knowledge/sections/RegulatoryStandardsSection.tsx` — render examples (ties into FE-021)

## Notes

- Examples must be technically accurate — use real units, realistic values, correct terminology per standard
- Keep each scenario to ~150 words and each report excerpt to ~10-15 lines — enough to be useful, not a textbook
- API 510 example can reference the existing template spec at `data/templates/example_pressure_vessel_api510.md` for consistency
- This directly supports FE-021 item 4 (Regulatory Standards examples in TIC Playbook)
