You are running Template QA — a quality check on a template specification. Validates completeness, accuracy, and readiness for deployment.

---

## Prerequisites

1. A template spec must exist in `/data/templates/` to check
2. Read the spec file
3. Read the relevant knowledge base files for the inspection type and standard

---

## Step 1: Identify the Spec

Ask the user which template spec to QA, or check `/data/templates/_template_index.md` for the most recent one. Read the spec file.

---

## Step 2: Run Quality Checks

### Check 1: Field Completeness
For every field required by the governing standard, verify it exists in the spec.

| Standard Requirement | Present in Spec | Field Name | Notes |
|---------------------|----------------|------------|-------|
| [requirement from regulatory_standards.md] | Yes/No/Partial | [field name in spec] | [any issues] |

**Result:** [Complete / Gaps found — list them]

### Check 2: Classification System
Verify the defect/finding classification system matches the standard.

- Does the spec use the correct classification codes? (C1/C2/C3/FI for electrical, major/minor/observation for audits, etc.)
- Are all classification options listed in dropdowns?
- Is there a mapping between classification and required action?

**Result:** [Correct / Issues found — list them]

### Check 3: Report Structure
Compare the spec's section structure against the universal report skeleton in `report_anatomy.md`.

- Are all universal sections present? (Header, scope, methodology, findings, conclusions, declarations, appendices)
- Is the section order logical and follows inspector workflow?
- Are there missing appendices or supporting sections?

**Result:** [Complete / Missing sections — list them]

### Check 4: Validation Rules
Check that the spec includes appropriate data validation:

- Required fields are marked as required
- Conditional fields have their conditions specified
- Numeric fields have reasonable ranges or constraints
- Dropdown fields have complete option lists
- Calculated fields have their formulas specified
- Cross-field validations are noted (e.g., "if finding severity = immediate action, then overall condition cannot = satisfactory")

**Result:** [Robust / Weak — list gaps]

### Check 5: Automation Opportunities
Verify the spec identifies where AI can add value:

- Pre-population from asset register or previous reports
- Auto-calculation (corrosion rates, remaining life, compliance checks)
- Auto-classification (severity from measurement data)
- Anomaly detection triggers
- Narrative generation from structured data

**Result:** [Well-identified / Additional opportunities — list them]

### Check 6: Layer 2 Mapping (if applicable)
If `/data/friday/tool_capture.md` is populated:

- Does every field in the spec map to a tool capability?
- Are there spec fields the tool can't handle?
- Are there tool features the spec doesn't leverage?

**Result:** [Fully mapped / Gaps — list them]

---

## Step 3: Score the Spec

| Check | Result | Score |
|-------|--------|-------|
| Field completeness | [result] | [Pass/Partial/Fail] |
| Classification system | [result] | [Pass/Partial/Fail] |
| Report structure | [result] | [Pass/Partial/Fail] |
| Validation rules | [result] | [Pass/Partial/Fail] |
| Automation opportunities | [result] | [Pass/Partial/Fail] |
| Layer 2 mapping | [result or N/A] | [Pass/Partial/Fail/N/A] |

**Overall:** [Ready for deployment / Needs revision — list what]

---

## Step 4: Update Status

1. Update the template spec's status field based on QA result:
   - All Pass → Status: "QA'd"
   - Any Partial → Status: "Draft — QA issues flagged"
   - Any Fail → Status: "Draft — revision required"
2. Update `/data/templates/_template_index.md` with new status
3. Log to `/data/friday/trial_log.md` (if during trial):

```
### [TIME] — Templating
**Context:** Template QA — [inspection type] ([standard])
**Result:** [overall result]
**Issues found:** [count and key issues]
**Status updated to:** [new status]
```

---

## Step 5: Report to User

Summarise:
- Overall QA result
- Specific issues found (grouped by severity)
- Recommended fixes
- Next steps: "Fix [issues] and re-run `/Template_QA`" or "Spec is clean — ready for deployment"

---

## Rules

- **Be thorough but concise.** List every issue but don't over-explain obvious ones
- **Check against the standard, not opinion.** Every "fail" must reference a specific standard requirement or best practice from the knowledge base
- **Don't auto-fix.** Report issues, don't silently fix the spec. The user decides what to change
- **Re-runnable.** Can be run multiple times on the same spec as issues are fixed
