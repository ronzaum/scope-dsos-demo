You are running Update Playbook — the intelligence compounding step. Every resolved issue and every deployment milestone makes the next deployment better.

---

## Prerequisites
- Read the client file that triggered this update: `/data/clients/[client_name].md`
- Read all playbook files:
  - `/data/playbook/deployment_playbook.md`
  - `/data/playbook/resolution_patterns.md`
  - `/data/playbook/client_type_definitions.md`

---

## What Triggers This Command

1. An issue was resolved that contains a new pattern (`/Resolve` flagged "Playbook update needed: Yes")
2. A deployment milestone was reached that produced a reusable insight
3. A deployment method worked notably well or poorly
4. A client type behaved differently than expected

---

## Step 1: Extract the Learning

From the client file, identify:
- **What happened:** The specific situation
- **What was learned:** The reusable insight (not the client-specific detail)
- **Conditions:** When does this apply? (client type, stage, scale, sector)
- **Confidence:** How certain is this pattern? (Single instance = low. Cross-client = high)

---

## Step 2: Check for Existing Patterns

Before adding anything new, check if this learning:
- Already exists in the playbook (→ update confidence, add the new data point)
- Partially exists (→ extend the existing entry)
- Contradicts an existing entry (→ flag the conflict, update with new evidence)
- Is genuinely new (→ add as new entry)

---

## Step 3: Update Playbook Files

### If deployment pattern:
Update `/data/playbook/deployment_playbook.md` — add or modify the relevant pattern entry:
```markdown
### [Pattern Name]
- **Source:** [client(s)] | [date(s)]
- **Applies when:** [conditions]
- **Pattern:** [what happens and why]
- **Recommended action:** [what to do]
- **Confidence:** Low / Medium / High (based on # of confirming instances)
- **Counter-evidence:** [any cases where this didn't hold]
```

### If resolution pattern:
Update `/data/playbook/resolution_patterns.md`:
```markdown
### [Issue Type] — [Pattern Name]
- **Source:** [client(s)] | [date(s)]
- **Category:** [issue category from /Log_Issue]
- **Root cause:** [underlying cause]
- **Resolution that works:** [proven solution]
- **Resolution that failed:** [what didn't work, if known]
- **Conditions:** [when this applies]
- **Confidence:** Low / Medium / High
```

### If client type insight:
Update `/data/playbook/client_type_definitions.md` with refined segmentation data.

---

## Step 4: Update Client File

Update the client file `/data/clients/[client_name].md`:

**Playbook Contributions** — add entry:
```markdown
- [date] | [pattern name] added to [playbook file]. Confidence: [level]
```

**Interaction History** — add entry: "[date] | Update_Playbook | Playbook updated with: [pattern name]. Source: [issue ID or milestone]"

---

## After Completion

Tell the user: "Playbook updated. New pattern: [name]. Confidence: [level]. This will be referenced in future deployments for [conditions]."

Show a brief summary of what changed in the playbook (diff-style: what was added or modified).
