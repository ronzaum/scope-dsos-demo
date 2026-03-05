# Scope AI — Product Knowledge

# Layer 1: Public Information

# Last Updated: 2026-03-02

---

## What Scope AI Does

AI-powered inspection automation for the Testing, Inspection, and Certification (TIC) industry. Replaces manual reporting (pen, paper, Excel, Word) with AI that writes error-free inspection reports automatically.

**Not** a general inspection SaaS with AI bolted on. The only AI-native platform custom-built for TIC.

---

## Core Capabilities

### Report Generation

- Writes error-free test, audit, and inspection reports automatically
- Auto-formats to client brand standards and regulatory formats
- Output format: PowerPoint (PPTX) — editable in PowerPoint/Google Slides/Keynote — plus PDF for preview and final delivery
- Supports multiple report types (EICR, LOLER thorough examination, pressure vessel condition reports, fire risk assessments, audit reports)
- Version control on generated reports

### Data Normalisation

- Normalises formatting across report types and client types
- Maps different inspector terminology to unified defect taxonomies
- Handles multiple template formats per client (different supervisors, different offices)
- Cross-format data reconciliation

### Compliance Checking

- Checks reports against regulation and client standards automatically
- Maps findings to specific regulatory clauses
- Flags non-compliant observations before report issuance
- Supports multi-jurisdictional requirements (UK, EU, DACH, US)

### Data Extraction

- Extracts data from technical documents: PDFs, Excel, manuals, diagrams
- Populates enterprise systems (CMMS, EAM)
- Handles legacy document digitisation

### Inspection Schema Generation

- Generates inspection schemas and Written Schemes of Examination (WSEs)
- Configurable inspection templates per client workflow
- Template intake and audit process for onboarding

### Anomaly Detection

- Finds and compares audit results against historical data
- Flags historical errors and inconsistencies
- Detects anomalous corrosion rates, degradation patterns, reading inconsistencies
- Reduces risk of major incidents through predictive intelligence

### Mobile Inspection Capture

- Mobile app for field inspectors with offline sync
- Quick capture mode: one-tap photo, auto-attached to current inspection point
- Structured data capture at point of examination
- Designed for 4-6 inspections/day field workflow

### Compliance Dashboards

- Real-time regulatory compliance views
- Portfolio-level asset condition overview
- Overdue examination flagging
- Trend analysis and KPI tracking

---

## Performance Claims


| Metric                               | Claim      |
| ------------------------------------ | ---------- |
| Inspection cycle time reduction      | 45%        |
| Average reporting time               | 12 minutes |
| End-to-end inspection time reduction | 2.2x       |


**Validated in deployments:**

- Bureau Veritas: 37% report turnaround improvement at month 3 (tracking toward 45% target)
- TÜV SÜD: 18% at month 5 (stalled — deployment issues, not product issues)

---

## Revenue Model

SaaS. Bespoke AI systems per client, deeply embedded into customer workflows.

**Customers are TIC companies** (the firms that perform inspections), not asset owners directly. End customers of TIC clients include Shell, AstraZeneca, SpaceX.

**Contract sizes:**

- Enterprise (top 10 TIC): £150k–£500k+ annual
- Mid-market (regional TIC): £50k–£150k annual

---

## Company Facts


| Fact             | Detail                                                         |
| ---------------- | -------------------------------------------------------------- |
| Location         | Clerkenwell, London                                            |
| Team size        | ~15 people                                                     |
| CEO              | Jonathan Low (ex-Conjecture, AI safety)                        |
| CTO              | Jakob Cassiman (ML engineer)                                   |
| Team backgrounds | Ex-DeepMind, Amazon, McKinsey                                  |
| Revenue growth   | 8x YoY                                                         |
| ARR target       | £10M by end of 2026                                            |
| Clients          | 7 of top 10 TIC companies globally                             |
| Customer base    | Represents 21% of UK GDP                                       |
| Funding          | Pre-seed 2024, Seed 2025 (Susa Ventures, 3x valuation step-up) |
| Series A         | Imminent                                                       |


---

## Moat

**Depth of per-client customisation.** Each deployment requires:

- Custom workflow mapping per enterprise client
- Bespoke data layer (inspection types, document types, regulatory standards)
- Client-specific template configuration
- Domain-specific anomaly detection tuning

Once embedded, switching costs are high. This moat is also the scaling constraint — each client needs bespoke work that doesn't scale linearly with headcount.

---

## Competitive Landscape


| Competitor               | What They Do            | Why Scope Wins                                                                                  |
| ------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------- |
| Checkfirst               | Digital checklists      | Scope is TIC-native with enterprise-grade bespoke layers                                        |
| SafetyCulture (iAuditor) | Mobile inspection forms | Scope wins on depth and per-client customisation. SafetyCulture hits limits at enterprise scale |
| Lumiform                 | Inspection templates    | Scope provides bespoke AI systems, not generic templates                                        |


**No direct competitor** offers AI-native, bespoke-per-client inspection automation for enterprise TIC.

---

## The Core Tension: Bespoke vs Scale

Scope's moat (bespoke data layers per client) is also the scaling constraint.

**Bottleneck:** Can win deals but need to deliver bespoke implementations faster without proportionally growing headcount.

**Solution approach:** Systematise the repeatable elements (report skeleton, regulatory mappings, template structures) while flagging the truly custom elements (client-specific workflows, unique integration points) for human judgment.

---

## Layer 2 Placeholder

> Tool-specific mechanics (Scope's actual product UI, workflows, API, configuration options) to be captured on arrival via `/Tool_Setup`. Layer 1 knowledge works from day one. Layer 2 makes it sharper.

