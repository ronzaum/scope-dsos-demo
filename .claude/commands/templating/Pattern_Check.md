You are running Pattern Check — scanning the template library for overlaps, reusable elements, and scalability signals.

---

## Purpose

As the template library grows, patterns emerge. Some sections are identical across inspection types. Some fields repeat everywhere. Some classification systems share logic. This command surfaces those patterns — proving that bespoke template work has a repeatable core. That's the scalability signal.

---

## Prerequisites

1. Read `/data/templates/_template_index.md` — get the full list of templates
2. Read all template spec files in `/data/templates/`
3. Read `/data/knowledge/report_anatomy.md` — the universal skeleton as a baseline

---

## Step 1: Scan for Overlaps

Compare all templates in the library. For each pair, identify:

### Shared Sections
Sections that appear in both templates with identical or near-identical structure.

| Section | Template A | Template B | Match Level | Notes |
|---------|-----------|-----------|-------------|-------|
| [section name] | [template] | [template] | Identical / Similar / Different structure | [what differs] |

### Shared Fields
Individual fields that appear across multiple templates.

| Field | Appears In | Type Consistent | Notes |
|-------|-----------|-----------------|-------|
| [field name] | [list of templates] | Yes/No | [any variations] |

### Shared Classification Systems
Defect/finding classification approaches that overlap.

| Pattern | Appears In | Variation | Notes |
|---------|-----------|-----------|-------|
| [classification approach] | [templates] | [how it varies] | [can it be unified?] |

---

## Step 2: Identify Reusable Elements

From the overlaps, extract concrete reusable elements:

### Universal Elements (appear in ALL templates)
- [element] — [what it is, why it's universal]

### Common Elements (appear in MOST templates)
- [element] — [what it is, which templates, why some don't have it]

### Domain-Specific Elements (unique to one type)
- [element] — [what it is, which template, why it's unique]

---

## Step 3: Scalability Assessment

Quantify the repeatable vs bespoke ratio:

```
Total unique fields across all templates: [N]
Fields that appear in 2+ templates: [N] ([%])
Fields that appear in ALL templates: [N] ([%])
Truly unique fields (single template only): [N] ([%])

Repeatable core: [%]
Bespoke layer: [%]
```

This ratio is the scalability signal. Higher repeatable core = more automation potential. The bespoke layer is where DS judgment lives.

---

## Step 3.5: Write Pattern Analysis File

Write the full analysis to `/data/templates/_pattern_analysis.md` in this exact structure (the API parses this file):

```markdown
# Pattern Analysis
# Generated: [YYYY-MM-DD]

## Overlap Map

| Pattern | Templates | Match Level |
|---------|-----------|-------------|
| [shared section/field] | [template A, template B] | [Identical/Similar] |

## Reusable Elements

| Element | Count | Templates |
|---------|-------|-----------|
| [field cluster name] | [N templates] | [list] |

## Scalability Signals

| Template | Reusable % | Bespoke Fields |
|----------|-----------|----------------|
| [template name] | [XX%] | [N fields unique to this template] |
```

This file is auto-parsed by the API and displayed in the frontend dashboard. It updates every time this command runs.

---

## Step 4: Update Pattern Index

Update the "Patterns & Overlaps" section of `/data/templates/_template_index.md`:

| Pattern | First Seen In | Reused In | Confidence |
|---------|--------------|-----------|------------|
| [pattern] | [first template] | [other templates] | [High/Medium/Low based on how many templates confirm it] |

---

## Step 5: Log and Report

Log to `/data/friday/trial_log.md` (if during trial):

```
### [TIME] — Templating
**Context:** Pattern Check — scanned [N] templates
**Repeatable core:** [%]
**Bespoke layer:** [%]
**Key patterns found:** [list top 3-5]
**Scalability signal:** [strong/moderate/weak]
```

Report to user:
- Top reusable patterns found
- Repeatable vs bespoke ratio
- Specific elements that could be extracted into a shared base template
- Recommendations for how to structure future templates to maximise reuse
- The scalability narrative: "X% of template work is repeatable across inspection types. The truly bespoke work is concentrated in [specific areas]."

---

## Rules

- **Minimum 2 templates required.** If only one template exists, tell the user: "Need at least 2 templates to check for patterns. Create more with `/Template_Spec` first."
- **Be precise about match levels.** "Identical" means exactly the same structure and fields. "Similar" means same concept but different implementation. Don't inflate overlap
- **The scalability narrative matters.** This is one of the most valuable outputs for the deployment strategy — it proves that bespoke work has a repeatable core
- **Update confidence levels.** A pattern seen in 2 templates is "Medium" confidence. Seen in 3+ is "High". One template can't establish a pattern
