You are running Constraint Mapping — the diagnostic step that maps who the users are, what they currently use, where workflows break, and how Scope's capabilities match.

This combines three analyses into one pass: User Mapping, Solutions Audit, and Product Match.

---

## Prerequisites
- Client file must exist with intelligence profile completed (`/Client_Intel` already run)
- Read `/data/clients/[client_name].md`
- Read `/data/playbook/deployment_playbook.md` for similar client precedents
- Read `/data/playbook/client_type_definitions.md` for segmentation context

---

## Part 1: User Map

Identify the actual users within the client organisation. For each user type:

| User Type | Count (est.) | Daily Reality | Language They Use | Top Pain Point | What They Care About |
|-----------|-------------|---------------|-------------------|----------------|---------------------|
| Field Inspector | | | | | |
| Supervisor | | | | | |
| Compliance Lead | | | | | |
| Report Consumer | | | | | |
| IT / Systems | | | | | |

Not all user types apply to every client. Include only those relevant.

For each user type, note:
- How they interact with inspection data today
- What frustrates them most
- What would make them adopt a new tool vs resist it

---

## Part 2: Solutions Audit

Document the client's current state:

**Current tools:** What software, systems, spreadsheets, or manual processes do they use today?

**Process map:** How does an inspection flow from start to report today? List each step.

**Friction points:** Where does the process break, slow down, or produce errors? Flag each with severity:
- 🔴 Blocking — causes failures, rework, or compliance risk
- 🟠 Degrading — slows the process, wastes time, frustrates users
- 🟢 Minor — inconvenient but tolerable

**What they have tried before:** Any past attempts to digitise or automate? What happened?

---

## Part 3: Product Match

Match the client's needs against Scope AI's capabilities:

| Client Need | Scope Capability | Fit | Priority | Notes |
|-------------|-----------------|-----|----------|-------|
| [need from user map + friction points] | [specific Scope feature] | Strong / Partial / Gap | High / Medium / Low | |

**Strong fits:** Features that directly solve their top pain points
**Partial fits:** Features that address the need but require configuration or customisation
**Gaps:** Needs where Scope doesn't have a current solution — flag for product team

Identify the **wedge use case**: the single deployment that proves value fastest with least friction.

---

## Output

Update the client file `/data/clients/[client_name].md`:

1. **Constraint Map section** — replace placeholder with the full user map, solutions audit, and product match from above
2. **Deployment State** — if new information changes the deployment assessment, update
3. **Interaction History** — add entry: "[date] | Constraint_Map | Constraint mapping complete. Wedge use case: [description]"

---

## After Completion

Tell the user: "Constraint map complete. Wedge use case identified: [description]. Next step: run `/Deploy_Plan` to synthesise the full deployment strategy."

If critical gaps exist in Scope's product fit, flag them: "Product gap: [description]. This should be logged via the product feedback loop."
