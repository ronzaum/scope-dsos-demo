You are running Report Map — analysing a customer's existing inspection report to map its structure. This feeds directly into `/Template_Spec`.

---

## Purpose

Take a customer's existing report (paper scan, PDF, Word doc, or verbal description) and reverse-engineer its structure. Map every section, field, and classification system. Identify what's standard, what's custom, and what's missing.

---

## Prerequisites

Read the following for context:

1. `/data/knowledge/report_anatomy.md` — universal report skeleton to compare against
2. `/data/knowledge/inspection_types.md` — expected fields for the inspection type
3. `/data/knowledge/regulatory_standards.md` — what the standard requires

---

## Step 1: Get the Report

Ask the user to provide the report. Accept any format:

- **Image/screenshot** — Read and analyse visually
- **PDF** — Read and extract structure
- **Verbal description** — User describes the report sections and fields
- **Copy-paste** — User pastes text from the report

If the user describes it verbally, ask clarifying questions to fill gaps. If they provide a document, extract the structure systematically.

---

## Step 2: Map the Structure

For each section of the customer's report, document:

### Report Map Output

```markdown
## Report Map: [Customer] — [Inspection Type]

### Metadata
- **Source:** [how this report was provided]
- **Inspection type:** [identified type]
- **Governing standard:** [identified or inferred]
- **Report format:** [paper/PDF/digital]
- **Quality assessment:** [good/average/poor — per report_anatomy.md criteria]

### Section-by-Section Map

#### Section [N]: [Section Name from Customer's Report]
| Customer's Field | Data Type | Maps To (Universal) | Standard Requirement | Notes |
|-----------------|-----------|---------------------|---------------------|-------|
| [field as named in their report] | [what type of data] | [equivalent from report_anatomy.md] | [which standard clause requires this] | [any observations] |
```

---

## Step 3: Gap Analysis

Compare the customer's report against what the standard requires and what the universal skeleton includes:

### Missing from Customer's Report
| Expected Field/Section | Required By | Severity | Notes |
|----------------------|------------|----------|-------|
| [what's missing] | [which standard] | [critical/important/nice-to-have] | [impact of omission] |

### Extra in Customer's Report (Not in Standard)
| Customer's Field | Purpose | Keep? | Notes |
|-----------------|---------|-------|-------|
| [custom field] | [why they include it] | [yes/no/maybe] | [whether to include in template spec] |

### Quality Issues Identified
| Issue | Location | Type | Notes |
|-------|----------|------|-------|
| [what's wrong] | [which section] | [vague/missing/inconsistent/non-compliant] | [how to fix in template] |

---

## Step 4: Produce Template Seed

Based on the mapping, produce a structured summary that feeds directly into `/Template_Spec`:

```markdown
## Template Seed

**Recommended sections:** [list based on customer's structure + standard requirements]
**Custom fields to preserve:** [customer-specific fields worth keeping]
**Fields to add:** [standard requirements the customer is missing]
**Classification system:** [what the customer uses vs what the standard requires]
**Sequence notes:** [how their report flows, where it deviates from standard sequence]
**Automation opportunities:** [where AI can add value based on their current pain points]
```

---

## Step 5: Save and Log

1. If this is substantial enough to save, write to `/data/templates/report_map_[customer]_[type].md`
2. Log to `/data/friday/trial_log.md` (if during trial):

```
### [TIME] — Templating
**Context:** Report Map — [customer] [inspection type]
**Sections mapped:** [count]
**Gaps found:** [count and key gaps]
**Quality issues:** [count and key issues]
**Ready for Template_Spec:** [yes/no, what's needed first]
```

---

## Step 6: Report to User

Summarise:
- How the customer's report maps to the standard
- Key gaps (what they're missing)
- Key strengths (what they do well or custom)
- Quality issues spotted
- Recommendation: "Ready to run `/Template_Spec` with this as input" or "Need more information about [specific area] before proceeding"

---

## Rules

- **Preserve customer terminology.** Map it to standard terminology but note what they call things. This matters for adoption — inspectors use their own language
- **Don't criticise, diagnose.** Frame gaps as "the standard requires X which isn't present" not "their report is missing X"
- **Flag custom fields as valuable.** Customer-specific fields often reflect real workflow needs that standards don't capture. These are intelligence about the client's actual process
- **Be explicit about quality.** If the report is vague, inconsistent, or non-compliant, say so clearly — this is exactly the problem Scope solves
