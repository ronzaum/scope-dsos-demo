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

## Rules

- It is still NOT time to build yet. Just write the clear plan document.
- No extra complexity or extra scope beyond what was discussed.
- Save the plan to `PLAN.md` in the project root.
