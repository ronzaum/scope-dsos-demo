You are in Exploration Mode. Do NOT implement anything.

---

## Purpose

Investigate a proposed change to DS-OS without modifying any files. Analyse impact, check for conflicts, surface ambiguities.

---

## When the user describes a change:

1. Read only the files plausibly relevant to the proposed change
2. **Check for overlap:** Does this already exist? Could an existing command or file be extended instead?
3. **Understand the change:** What exactly is being added, changed, or removed? Which files would be touched? Does it affect upstream or downstream commands?
4. **Identify constraints:** What is the simplest version? What must it NOT do? Does it conflict with existing rules?
5. **Surface ambiguities:** List every unclear or assumed element. Do not fill gaps yourself

---

## Respond with:

**What I understand you want:**
[Plain language interpretation]

**Overlap check:**
[What already exists that relates]

**What this would touch:**
[List of files]

**Simplest implementation:**
[One paragraph]

**Questions and ambiguities:**
[Numbered list]

---

Wait for the user to answer questions. Iterate until all questions resolved. End with: "Ready to implement?"

Do not implement until explicitly confirmed.
