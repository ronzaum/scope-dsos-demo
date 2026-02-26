You are running Pivot — the universal method and rule change command. This is the ONLY command that modifies the method registry and propagates changes across all deployments.

Use this when a deployment method, process, or rule needs to change everywhere, not just for one client.

---

## Prerequisites
- Read `/data/system/method_registry.md` — current methods and rules
- Read ALL client files in `/data/clients/` — to assess impact
- Read `/data/playbook/deployment_playbook.md` — to check if the change contradicts or confirms existing patterns

---

## Step 1: Define the Change

Ask the user (or derive from context):

1. **What is changing?** (deployment method, onboarding rule, escalation trigger, review cadence, feature sequencing default)
2. **Why?** (evidence: which client(s), which issue(s), which pattern triggered this)
3. **Scope:** Is this universal (all clients, all future deployments) or conditional (specific client types, stages, or sectors)?

---

## Step 2: Impact Assessment

For each active client, assess:

| Client | Current Method | Affected? | Impact | Required Action |
|--------|---------------|-----------|--------|----------------|
| | | Yes/No | High/Med/Low/None | |

Flag any client where the change would:
- Disrupt an in-progress deployment
- Contradict a commitment made to the client
- Require re-planning or re-sequencing

---

## Step 3: Show the Diff

Before applying anything, show the user exactly what will change:

**Method Registry Changes:**
```
BEFORE: [current rule/method]
AFTER:  [proposed change]
```

**Client Files Affected:** [list]

**Playbook Updates Needed:** [list, if any]

**Risk:** [what could go wrong with this change]

---

## Step 4: Wait for Confirmation

Do NOT apply changes until the user explicitly confirms.

Say: "Here is the proposed pivot. [X] clients affected. [Y] method registry entries changed. Confirm to apply, or adjust."

---

## Step 5: Apply (after confirmation only)

1. Update `/data/system/method_registry.md` with the new rule/method
2. For each affected client, add a note to their Interaction History: "[date] | Pivot | Method change applied: [description]. Previous: [old]. New: [new]"
3. Update `/data/system/system_log.md`: "[date] | PIVOT | [description]. Affected clients: [list]. Evidence: [source]"
4. If the change introduces a new playbook pattern, flag it: "Consider running `/Update_Playbook` to formalise this change as a pattern"

---

## After Completion

Tell the user: "Pivot applied. [X] clients updated. Method registry changed: [summary]. System log updated."

If any client needs immediate re-planning: "⚠️ [Client name] may need a revised deployment plan. Current plan was based on [old method]. Consider running `/Deploy_Plan` to update."
