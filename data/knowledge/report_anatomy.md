# TIC Report Anatomy — Knowledge Base
# Layer 1: Industry Knowledge
# Last Updated: 2026-03-02

---

## Universal Report Skeleton

Every TIC inspection report, regardless of type, follows this core structure. The skeleton has evolved from regulatory requirements (UKAS, ILAC, ISO 17020, ISO 17025), insurance requirements, and practical necessity.

### Section 1: Header / Identification Block
First page and often in header/footer on every page.

| Field | Purpose | Notes |
|-------|---------|-------|
| Report number | Unique identifier | Usually includes year prefix (e.g., BV-2026-041822) |
| Date of examination | When inspection physically occurred | Critical for statutory compliance — late examinations are a legal issue |
| Date of report | When report was written/issued | Regulators track the gap between these dates |
| Client name | Legal entity commissioning inspection | May differ from site occupier |
| Site/location | Physical address | Key differentiator for multi-site clients |
| Equipment/asset ID | Unique item identifier | Client asset number, serial number, or TIC body's plant ID |
| Equipment description | What the item is | Make, model, capacity, year of manufacture |
| Inspector name & ID | Who performed examination | Competent person declaration — legally significant |
| Inspection standard/scheme | Governing regulation/standard | e.g., LOLER 1998, BS 7671, API 510 |
| Previous report reference | Link to last examination | Enables trending and comparison |
| Examination type | Periodic, initial, after repair, special | Drives scope of work |

### Section 2: Scope and Limitations
Defines boundaries of the examination. **Legally critical** — establishes what was and was not examined.

- What was included (systems, components, areas)
- What was excluded and why (inaccessible, client refused shutdown, not in scope)
- Limitations (e.g., "vessel not gas-freed, internal examination not performed")
- Reference to examination scheme / WSE if applicable
- Environmental conditions affecting examination

> **AI opportunity:** Scope and limitations are almost always free-text prose, inconsistently captured across inspectors. High-value area for normalisation — turning free-text into structured, queryable data.

### Section 3: Methodology / Procedures
How the examination was conducted.

- Examination method (visual, NDT technique, functional test, document review)
- Equipment/instruments used (model, serial, calibration date)
- Reference standards and acceptance criteria
- Sampling approach (for audits)
- Procedure references (internal work instructions, client-specific procedures)

### Section 4: Findings / Observations
The core of every report. Universal finding components:

| Component | Description |
|-----------|-------------|
| **Observation ID** | Unique within report (Finding 1, Defect A, Observation 3.2.1) |
| **Location** | Where on asset/site |
| **Description** | What was observed (factual, not interpretive) |
| **Classification/Severity** | How serious (see classification systems below) |
| **Evidence** | Photographs, measurements, test data |
| **Recommendation** | What action is needed |
| **Timeframe** | When action must be completed |
| **Reference** | Which regulation/standard clause applies |

### Section 5: Conclusions and Recommendations
Overall condition and professional judgment.

- Overall condition assessment (satisfactory/unsatisfactory/conditional)
- Whether equipment is safe to continue in service
- Whether a statutory report is being raised
- Summary of critical findings
- Recommended next examination date and type
- Conditions for continued use

> **Legal significance:** For statutory examinations (lifting equipment, pressure systems), the conclusion is a legal declaration. "Not safe to continue in use" triggers mandatory withdrawal from service.

### Section 6: Certifications / Declarations
- Competent person declaration
- Accreditation statement (UKAS, ILAC)
- Statement of independence and impartiality
- Signature (wet or electronic)
- Professional qualifications

### Section 7: Appendices
- Photographs (labelled with finding references)
- Data tables (thickness readings, test results)
- Calibration certificates
- Drawings/sketches (corrosion mapping, defect location diagrams)
- Previous report data for trending

---

## Classification Systems by Domain

### Universal Severity Scale (typical TIC variant)
| Code | Meaning | Action |
|------|---------|--------|
| A / Immediate | Imminent risk to persons | Equipment out of service immediately |
| B / Urgent | Action within defined period | Rectification within specified timeframe (often 28 days) |
| C / Routine | Action needed, no immediate risk | Rectification before next examination |
| D / Advisory | Recommendation for improvement | No mandatory action |

### Domain-Specific Scales

**Electrical (BS 7671):**
- C1 = Danger present → C2 = Potentially dangerous → C3 = Improvement recommended → FI = Further investigation

**Lifting (LOLER):**
- Imminent danger (notify HSE) → Could become danger (repair deadline) → No defect

**QMS Audits (ISO 9001):**
- Major NC → Minor NC → Observation/OFI

**Manufacturing (AQL):**
- Critical (AQL 0) → Major (AQL 2.5) → Minor (AQL 4.0)

**Fire Safety:**
- Intolerable → Substantial → Moderate → Tolerable

**Pressure Vessels:**
- Corrosion rate severity + remaining life calculation (quantitative, not categorical)

> **Key challenge:** Bureau Veritas severity codes differ from Intertek's differ from TÜV's. Even within a single TIC body, classification can drift between offices and inspectors. Normalising across these systems is a core AI value proposition.

---

## Variations by Inspection Type

### Pressure Vessel Reports
Unique sections beyond the skeleton:
- **Thickness measurements table:** Location, original, previous, current, min allowable, corrosion rate, remaining life
- **Corrosion mapping:** Colour-coded grid showing wall thickness across vessel surface
- **Safety devices condition:** Pressure relief valves, bursting discs, safety interlocks
- **Remaining life assessment:** When vessel will reach minimum allowable thickness
- **Fitness-for-service assessment:** Per API 579 / BS 7910 for vessels with defects

> **Unique value:** Heavily data-driven. Core value is trending thickness readings over time. A single report has moderate value; a series enables predictive maintenance.

### Electrical Reports (EICR)
Unique sections beyond the skeleton:
- **Schedule of circuits tested:** Every circuit with CPD type/rating, cable type/size
- **Test results tables:** Per BS 7671 — R1+R2, insulation resistance, Zs, RCD trip times, PSCC per circuit
- **Observation codes:** C1/C2/C3/FI classification per finding
- **Distribution board schedules:** Circuit-by-circuit breakdown per board
- **Overall assessment:** Binary "Satisfactory" or "Unsatisfactory" (no middle ground)

> **Unique value:** Most tabular report type. Test results are almost entirely numerical. AI normalisation of observation descriptions to consistent coding is extremely valuable.

### Lifting Equipment Reports (LOLER)
Unique sections beyond the skeleton:
- **SWL/WLL verification:** Marked vs tested, configuration for multi-leg slings
- **LOLER-specific defect classification:** Immediate danger vs could become danger
- **Next thorough examination date:** Legally mandated (6/12 months)
- **Marking verification:** SWL markings, CE/UKCA, manufacturer's data plate
- **Functional tests:** Limit switches, brakes, emergency stops, overload protection
- **Wire rope examination:** Broken wires per lay length, corrosion, diameter reduction

> **Unique value:** Highest volume. LOLER report format is prescribed by regulation — relatively standardised. Volume + standardisation = prime automation target.

### NDT Reports
Unique sections beyond the skeleton:
- **Technique parameters:** Method-specific (UT: frequency, probe, calibration; RT: source, exposure, IQI; MPI: magnetisation, particles, UV; PT: penetrant system, dwell time; ET: frequency, probe type)
- **Operator qualification:** Certification level (1/2/3), scheme (PCN/CSWIP/ASNT)
- **Acceptance criteria reference:** Specific standard clauses
- **Indication mapping:** Drawing/sketch or coordinate-based table

> **Unique value:** Most technically dense. A single weld may have multiple technique reports each with completely different data structures.

### Fire Safety Reports (FRA)
Unique sections beyond the skeleton:
- **Risk rating matrix:** Likelihood × Consequence = overall fire risk level
- **Fire hazard identification:** Ignition sources, fuel sources, oxygen sources
- **Means of escape assessment:** Travel distances, exit widths, signage, emergency lighting
- **Compartmentation assessment:** Fire-resisting construction, service penetrations, fire stopping
- **Fire detection system assessment:** Category, coverage, service dates
- **Action plan:** Priority-rated with responsible person and target dates

> **Unique value:** Most qualitative. Significant professional judgment. Two assessors may produce substantially different risk ratings for the same building. AI consistency enforcement is high-value.

### Factory Audit Reports
Unique sections beyond the skeleton:
- **Audit plan:** Clauses/processes covered, departments, people interviewed, time allocation
- **Clause-by-clause findings:** Standard clause reference, process, evidence, classification, NC statement
- **Corrective action requests (CARs):** Root cause analysis, proposed action, evidence to close, deadline, verification
- **Audit summary:** NC counts, recommendation (certify/maintain/suspend/withdraw)
- **Previous findings follow-up:** Status and effectiveness of corrective actions

> **Unique value:** Process-based, not asset-based. Findings are largely textual. Pattern recognition across audits (which clauses generate most NCs) is a strong AI application.

---

## Good vs Bad Reports

### What Makes a Report High Quality

**Clear, specific findings:**
- BAD: "Some corrosion was noted on the vessel shell."
- GOOD: "Localised pitting corrosion observed on the lower shell course, 6 o'clock position, 300mm above the bottom weld seam. Maximum pit depth 2.3mm measured by pit gauge. Area affected approximately 150mm × 100mm."

**Proper classification with justification:**
- BAD: "C2 — wiring not to current standard."
- GOOD: "C2 — Single insulated cables within metal trunking at DB3, contrary to BS 7671:2018 Regulation 521.10.1. Risk of insulation damage from cable movement against trunking edges. Remedial action required within 28 days."

**Actionable recommendations:**
- BAD: "Recommend repair."
- GOOD: "Recommend pad welding to restore minimum wall thickness at locations Shell-3 and Shell-4 (currently below minimum allowable of 8.5mm). Repair per approved procedure per PD 5500. Post-repair UT to verify weld integrity. Re-examination at 12-month interval for two cycles to confirm corrosion rate has not accelerated."

**Evidence-backed:**
- Every finding references supporting evidence (photo number, measurement, test result)
- Photographs labelled, referenced, sufficient quality to clearly show defect
- Measurement data in tables with clear units, references, acceptance criteria

**Consistent:**
- Same classification system used throughout
- Findings numbered consistently
- Terminology consistent (not switching between "defect", "finding", "observation", "issue")

**Complete scope:**
- Clear statement of what was examined
- Equally clear statement of what was NOT examined and why
- Assumptions stated explicitly

**Trending and context:**
- Comparison to previous examination results
- Rates calculated from historical data
- Conditions improving, stable, or deteriorating noted

### Common Report Failures

| Failure | Impact |
|---------|--------|
| **Vague observations** | Most common. "Some wear noted" — where? How much? Acceptable? |
| **Missing data** | Blank fields in test tables. No explanation for gaps |
| **Inconsistent classification** | Same finding type classified differently in same report |
| **No photographs / poor photos** | Findings described but not evidenced. Too dark, too distant, unlabelled |
| **Unclear scope** | Client reads report as "clean bill of health" when areas were excluded |
| **Late issuance** | Memory degradation. Statutory reports outside legal timeframes |
| **Copy-paste errors** | Previous report text not updated. Wrong client name, site, equipment details |
| **No prioritisation** | All findings listed without severity ranking. Client can't determine what's urgent |

---

## Digital Transition State

### Industry Distribution
- **Leaders (10-15%):** Full digital workflow. Tablet capture → auto-report → portal delivery. Still often end up as PDFs
- **Middle (50-60%):** Mixed. Some digital scheduling, but inspectors use paper/notes. Reports typed up at office. PDF via email
- **Laggards (30-40%):** Entirely paper-based. Handwritten or Word with no template enforcement

### Data Normalisation Challenges

**Inconsistent terminology:**
"Corrosion", "rust", "material loss", "wall thinning", "wastage" — may all describe the same condition. No universal defect taxonomy exists in TIC.

**Inconsistent classification:**
Different TIC bodies use different severity scales. Mapping between scales is not 1:1. Even within a single TIC body, classification drifts between offices/inspectors.

**Unstructured free text:**
Most valuable data (what the inspector found) locked in prose. Extracting structured data requires NLP that understands domain-specific terminology.

**Multiple formats:**
PDF (some machine-readable, some scanned images), Word, Excel, proprietary software exports, handwritten scans, XML/JSON (rare).

**Legacy data:**
Decades of paper archives. Critical for trending (need 3-5 data points over years for meaningful corrosion rates). OCR quality varies.

**Units and conventions:**
Metric vs imperial. Clock positions vs compass bearings. Different datum points. Temperature/pressure in various units.

**Regulatory variation:**
Same inspection has different reporting requirements per jurisdiction. UK LOLER vs EU Machinery Directive vs US ASME/API.

---

## Where AI Adds Value in Report Generation

### Tier 1: Highest Value, Most Achievable
1. **Automated report drafting** — Inspector captures structured data on device → AI generates narrative sections → inspector reviews and approves. 40-60% reduction in report writing time
2. **Consistency enforcement** — AI checks classification consistency, flags when similar findings classified differently, ensures mandatory fields populated, cross-checks measurements against acceptance criteria
3. **Data normalisation** — Map terminology to unified taxonomy, normalise severity scales, extract structured data from free text

### Tier 2: High Value, More Complex
4. **Automated trending** — Track measurements across cycles, calculate degradation rates and remaining life, flag anomalies
5. **Cross-client pattern recognition** — Same equipment type + same conditions = same failure modes across different clients
6. **Anomaly detection** — Readings that don't make physical sense, inconsistencies between visual and measurement data

### Tier 3: Transformative, Longer-Term
7. **Automated compliance mapping** — Findings mapped to specific regulatory requirements automatically
8. **Natural language querying** — "Show me all pressure vessels with <5 years remaining life" across thousands of reports
9. **Photo/image analysis** — AI-assisted interpretation of inspection photographs, automated corrosion mapping
