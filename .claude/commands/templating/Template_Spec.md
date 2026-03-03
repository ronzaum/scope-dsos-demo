You are running Template Spec — the main templating work command. Given an inspection type and context, produce a structured template specification that defines exactly what data must be captured and how.

---

## Prerequisites

Read the following before starting:

1. `/data/knowledge/inspection_types.md` — process flow, fields, instruments for the given inspection type
2. `/data/knowledge/regulatory_standards.md` — governing standards, classification systems, report requirements
3. `/data/knowledge/report_anatomy.md` — universal report skeleton, variations by type
4. `/data/friday/tool_capture.md` — Scope's tool mechanics (Layer 2). If populated, map spec to actual product capabilities. If empty, produce tool-agnostic spec
5. `/data/templates/_template_index.md` — check for existing templates that might overlap
6. `/data/templates/example_pressure_vessel_api510.md` — reference pattern for spec structure

---

## Step 1: Gather Context

Ask the user (or extract from what they've provided):

1. **Inspection type** — Which type? (pressure vessel, lifting equipment, electrical, NDT, factory audit, fire safety, other)
2. **Governing standard(s)** — Which specific standards apply? (e.g., API 510, LOLER, BS 7671)
3. **Client context** — Who is this for? Any client-specific requirements?
4. **Scope of the template** — Full inspection report or a specific section?
5. **Any existing reports to reference?** — If the client has existing paper/digital reports, run `/Report_Map` first

If the user provides an inspection type and the standard is obvious (e.g., "pressure vessel" → API 510), don't ask — proceed.

---

## Step 2: Build the Spec

Produce a template specification following this structure. Use the example at `/data/templates/example_pressure_vessel_api510.md` as the reference pattern.

### Spec Structure

```markdown
# Template Spec: [Inspection Type] ([Standard])
# Type: [Client-specific / Generic / Example]
# Created: [date]
# Status: Draft (Layer 1) / Draft (Layer 1 + 2)

## Overview
- Inspection type, primary standard, supporting standards
- Typical client context
- Layer 2 status (tool-agnostic or mapped to Scope's product)

## Section N: [Section Name]
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| [field] | [type] | [Yes/No/Conditional] | [validation, options, notes] |

## Template Configuration Notes
- Sequence (inspector's natural workflow)
- Automation opportunities
- Validation rules
```

### Field Types
Use these consistently:
- `Text` — free text entry
- `Number` — numeric value
- `Date` — date picker
- `Boolean` — yes/no
- `Dropdown` — predefined options (list the options in Notes)
- `Multi-select` — multiple predefined options
- `Free text` — longer narrative entry
- `Calculated` — auto-derived from other fields
- `Auto-generated` — system-generated (report number, IDs)
- `Photo attachment` — image capture
- `Signature` — wet or electronic signature

### What to Include in Each Section
- Every field the inspector needs to capture
- Data type and validation for each field
- Whether required, optional, or conditional (state the condition)
- Dropdown options where applicable
- Automation opportunities (pre-populate, auto-calculate, auto-classify)
- Anomaly detection triggers (what readings should be flagged)

---

## Step 3: Layer 2 Mapping (if available)

If `/data/friday/tool_capture.md` is populated:

1. **Map fields to tool capabilities** — For each field, note how it maps to Scope's actual UI (dropdown, text input, photo capture, etc.)
2. **Flag gaps** — Fields in the spec that the tool doesn't support
3. **Flag extras** — Tool features that could enhance the spec but weren't in Layer 1
4. **Note configuration steps** — How to actually set this up in Scope's product

If tool capture is empty, note: "Tool-agnostic spec. Run `/Tool_Setup` to capture product mechanics, then re-run this command to map."

---

## Step 4: Cross-Reference

1. **Check template index** — Does this overlap with any existing template? If yes, note what's shared and what's different
2. **Check knowledge base** — Verify all fields against the regulatory standard requirements. Flag any field that the standard requires but the spec doesn't include

---

## Step 5: Save and Index

1. Save the spec to `/data/templates/[inspection_type]_[standard].md`
   - Filename: lowercase, underscores, descriptive (e.g., `electrical_eicr_bs7671.md`, `lifting_loler.md`)
2. Update `/data/templates/_template_index.md` — add a row with: number, type, standard, client context, status, filename
3. Log to `/data/friday/trial_log.md` (if during trial):

```
### [TIME] — Templating
**Context:** Template Spec — [inspection type] ([standard])
**Sections:** [number of sections, total fields]
**Layer 2 mapped:** [yes/no]
**Overlaps with:** [existing templates if any]
**Gaps flagged:** [any standard requirements not covered]
```

---

## Step 6: Report to User

Summarise the spec:
- Sections and total field count
- Key automation opportunities identified
- Any gaps or issues flagged
- Overlaps with existing templates
- Next steps: "Run `/Template_QA` to quality check this spec" or "Run `/Pattern_Check` to scan for reusable elements across the library"

---

## Rules

- **Follow the knowledge base.** Every field must be traceable to either the regulatory standard, the report anatomy, or the inspection type process flow. Don't invent fields
- **Match inspector workflow.** Section order must follow the inspector's natural sequence, not an arbitrary logical order
- **Be specific on dropdowns.** List all options. Don't write "Dropdown" without specifying the choices
- **Flag, don't skip.** If a standard requires something you can't fully spec (e.g., a complex calculation), flag it rather than omitting it
- **One spec per file.** Each template spec gets its own file in `/data/templates/`
