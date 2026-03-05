# FE-020: TIC Playbook — UX Overhaul & Content Enrichment

**Type:** Improvement | **Priority:** High | **Effort:** Large
**Parent:** FE-019 (TIC Playbook Page)

## TL;DR

Five changes to the TIC Playbook page: single-section expansion with fixed right panel, blue colour scheme, magazine-style card previews, richer content with examples across Inspection Cycle / Regulatory Standards / Report Structure, and commercial hero metrics on Scope Product.

## Current State

- Multiple sections can open simultaneously — cluttered when exploring
- Expanded content renders below the card row — pushes cards off screen
- Rainbow colour tints across cards (blue, violet, amber, emerald, rose, cyan, orange)
- Card previews are text-only bullet lists of first 3-4 item names
- Inspection Cycle steps show one-line detail, no examples
- Regulatory Standards detail has structured data but no worked examples or scenarios
- Report Structure shows skeleton sections but doesn't surface the good/bad examples already parsed
- Scope Product metrics are tucked at the bottom of the left panel, not prominent

## Expected Outcome

### 1. Section Behaviour (all 7 sections)

**a) Single section open at a time**
- Replace `expandedSections: Set<string>` with `expandedSection: string | null`
- Opening a section closes the previously open one

**b) Fixed right detail panel**
- When no section is selected: full-width card grid (right panel hidden)
- When a section is selected: cards stay at current size on the left, fixed-width detail panel appears on the right
- Card grid does not resize or collapse

**c) Blue colour scheme**
- Replace rainbow tints with 7 different shades of blue
- Light to deep progression across the 7 cards
- Maintain the subtle tint approach (bg opacity stays low)

**d) Magazine-style miniature previews**
- Replace text-only bullet lists on cards with visual previews
- Mix of: data-driven mini SVG graphics (tiny flow diagram for Inspection Cycle, dots-and-lines for Stakeholders, etc.) and styled stat badges ("6 types", "8 standards")
- Future upgrade: hand-drawn illustrations replacing the data-driven minis

### 2. Inspection Cycle — Example Boxes

- Each process step gets 1-3 generic scenario examples (not client-named)
- Number of examples varies by step complexity/dependency
- Rendered as a distinct callout/box within the step detail panel
- Domain-specific content, e.g. "In a petrochemical pressure vessel inspection, pre-inspection includes reviewing the Written Scheme of Examination and 5 years of thickness trending data"

### 3. Regulatory Standards — Worked Examples + Scenarios

- Quantitative worked examples per standard (calculations, thresholds, remaining life formulas)
- Qualitative scenario descriptions per standard (real-world application stories)
- Both embedded within the existing detail panel for each standard

### 4. Report Structure — Good/Bad Toggle

- Each skeleton section gets a toggle revealing good vs bad examples
- Default view stays clean — examples are one click away
- Create new examples for sections currently missing them:
  - Header / Identification Block
  - Scope and Limitations
  - Methodology / Procedures
  - Certifications / Declarations (combine with Appendices)
- Map existing `goodVsBad` parsed data to relevant sections (Findings, Classification, Recommendations)

### 5. Scope Product — Hero Metrics + Per-Capability Maturity

- Three hero metric cards at top of section: adoption rate, active users, product maturity
- Data aggregated from client files (BV, Intertek, TUV SUD) — updates when client data changes
- Per-capability maturity labels shown alongside each capability (Live, Beta, Planned, etc.)
- Foundation for future live analytics integration

## Files

### Must change
- `frontend/src/pages/Knowledge.tsx` — layout restructure (card grid + right panel), single-section state
- `frontend/src/components/knowledge/SectionCard.tsx` — blue tints, miniature preview components
- `frontend/src/components/knowledge/SectionExpansion.tsx` — may simplify since routing moves to right panel
- `frontend/src/components/knowledge/sections/InspectionCycleSection.tsx` — example boxes per step
- `frontend/src/components/knowledge/sections/RegulatoryStandardsSection.tsx` — worked examples + scenarios
- `frontend/src/components/knowledge/sections/ReportStructureSection.tsx` — good/bad toggle per section
- `frontend/src/components/knowledge/sections/ScopeProductSection.tsx` — hero metrics, per-capability maturity
- `api/parsers/knowledge.js` — enrich data: examples for inspection steps, regulatory worked examples, report section examples, capability maturity labels, aggregated client metrics

### May change
- `frontend/src/components/knowledge/FlowDiagram.tsx` — mini version for card previews
- `frontend/src/components/knowledge/KnowledgePanel.tsx` — may need layout adjustments for side panel mode
- `frontend/src/data/fallbacks.ts` — update fallback data to match new schema
- `data/knowledge/scope_product.md` — add per-capability maturity data

### New files (likely)
- `frontend/src/components/knowledge/MiniPreview.tsx` — miniature SVG preview components for cards
- `frontend/src/components/knowledge/ExampleBox.tsx` — reusable example callout component

## Notes

- The example content (inspection steps, regulatory scenarios, report good/bad) is substantial — most of the effort is content authoring + data structure, not UI
- Hero metrics on Scope Product aggregate from client files — needs a new API computation or parser addition
- Mini SVG previews are data-driven for now; hand-drawn illustrations are a future upgrade (note in code)
- The right-panel layout pattern may be reusable for other pages later
