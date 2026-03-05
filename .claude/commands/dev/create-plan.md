You are running Create Plan — the plan creation stage. Based on the full exchange so far, produce a markdown execution plan.

---

## Requirements

- Include clear, minimal, concise steps.
- Track the status of each step using these emojis:
  - 🟩 Done
  - 🟨 In Progress
  - 🟥 To Do
- Include dynamic tracking of overall progress percentage (at top).
- Do NOT add extra scope or unnecessary complexity beyond explicitly clarified details.
- Steps should be modular, elegant, minimal, and integrate seamlessly within the existing codebase.

---

## Output Template

Write the plan in this format:

```markdown
# Feature Implementation Plan

**Overall Progress:** `0%`

## TLDR
Short summary of what we're building and why.

## Critical Decisions
Key architectural/implementation choices made during exploration:
- Decision 1: [choice] — [brief rationale]
- Decision 2: [choice] — [brief rationale]

## Tasks

- [ ] 🟥 **Step 1: [Name]**
  - [ ] 🟥 Subtask 1
  - [ ] 🟥 Subtask 2

- [ ] 🟥 **Step 2: [Name]**
  - [ ] 🟥 Subtask 1
  - [ ] 🟥 Subtask 2
```

---

## Sanity Check

Before finalising, run these three checks against the draft plan. Fix any issues before writing to `PLAN.md`.

### 1. AI Slop

Read every step and subtask. Every item must describe a concrete, verifiable action. If a step could not be checked off by someone reading the code diff, rewrite it until it can.

Remove or rewrite:
- Vague qualifiers ("ensure robustness", "optimize as needed", "handle edge cases")
- Filler that restates intent without adding specifics ("improve the overall experience")
- Steps that describe a goal instead of an action ("make the system more reliable")

### 2. Coverage

Cross-reference the plan against everything discussed in this thread — the full `/explore` exchange and any `/create-issue` output (if an issue was created, reference it by file, e.g., `Addresses issues/010-template-report-generator.md`).

- Every requirement, decision, and constraint from the conversation MUST appear in the plan.
- If something was discussed but is missing, add it or explicitly note why it was dropped.

### 3. Scope Creep

Reverse of coverage. Every step in the plan MUST trace back to something discussed in this thread.

- If a step was not mentioned during explore or in the issue, remove it.
- No invented extras. No "while we're at it" additions.

---

## Splitting Large Plans

After the sanity check, assess whether the plan is too heavy for a single `/dev:execute` session. Consider total step count, number of files touched, and how many independent concerns are involved.

If the plan needs splitting:
- Group steps into named **execution groups** by foundational dependency (e.g., Group A must complete before Group B can start).
- Add an `## Execution Groups` section to the plan listing each group, its steps, and a one-line summary.
- After writing the plan, present each group to the user for approval before proceeding.
- For each group, provide a paste-ready prompt:

```
/dev:execute Group [X] — [Name]: [one-line summary of what this group builds]. Steps [N–M] in PLAN.md.
```

The prompt must be self-contained — anyone pasting it into a fresh thread with access to `PLAN.md` can execute it without extra context.

---

## Rules

- It is still NOT time to build yet. Just write the clear plan document.
- No extra complexity or extra scope beyond what was discussed.
- Save the plan to `PLAN.md` in the project root.
- Do NOT skip the sanity check. Run all three checks and fix before saving.
