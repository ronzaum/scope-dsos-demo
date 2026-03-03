You are running Tool Setup — capturing Scope's actual product mechanics (Layer 2 knowledge). This is re-runnable. Each run adds to or refines what's already captured.

---

## Purpose

Capture how Scope's product actually works — UI, workflows, configuration options, data flows, limitations. This transforms Layer 1 knowledge (what the industry needs) into Layer 2 knowledge (how Scope delivers it). Every other command gets sharper once this is populated.

---

## Prerequisites

- Read `/data/friday/tool_capture.md` first to see what's already captured
- Read `/data/knowledge/scope_product.md` for context on claimed capabilities

---

## Step 1: Determine What to Capture

Check `/data/friday/tool_capture.md` for empty sections. Prioritise capturing in this order:

1. **Product interface** — login, navigation, main screens (capture first, everything else depends on this)
2. **Inspector mobile workflow** — how inspectors actually use it in the field (highest operational value)
3. **Inspection template configuration** — how templates are created and assigned (core for `/Template_Spec`)
4. **Report generation** — how reports are generated, reviewed, approved (core for templating work)
5. **Data flow** — import/export, integrations, API (important for deployment)
6. **Anomaly detection** — configuration, alerts, output (value-add feature)
7. **Compliance checking** — rules setup, auto-check behaviour (value-add feature)
8. **Dashboard** — available views, KPIs, filtering (management layer)

If the user provides information about a specific area, capture that area. Don't force the order.

---

## Step 2: Structure the Input

The user will describe what they see or experience in freeform. Your job is to **structure it**.

For each piece of information:
1. Identify which section of `tool_capture.md` it belongs to
2. Extract the key facts
3. Write them in the structured format of that section

**Example:**
- User says: "So you click 'New Inspection' on the top bar, select the template from a dropdown, and it pre-fills the equipment data from the asset register"
- You capture under **Inspection Template Configuration → How Templates Are Assigned**: "Templates selected from dropdown in 'New Inspection' flow. Equipment data pre-populated from asset register."

---

## Step 3: Flag Gaps and Surprises

As you capture, actively flag:

1. **Gaps between claimed and actual** — If the knowledge base says Scope does X but the tool doesn't do X, or does it differently, flag it: "Gap: [capability] — claimed [X], actual [Y]"

2. **Limitations discovered** — Things the tool can't do that would matter for deployment. Add to the "Gaps & Limitations" table in `tool_capture.md`

3. **Strengths discovered** — Things the tool does well that weren't obvious from public info. Note these as positive captures

4. **Questions the tool raises** — Things you'd want to ask the Scope team based on what you've seen

---

## Step 4: Write to Tool Capture

Update `/data/friday/tool_capture.md` with all captured information. Update the "Last Updated" timestamp.

Also add a timestamped entry to `/data/friday/trial_log.md`:

```
### [TIME] — Technical
**Context:** Tool Setup — capturing product mechanics
**Observation:** [key things captured]
**Gaps found:** [any gaps between claimed and actual]
**Layer 2 sections populated:** [list]
**Sections still empty:** [list]
```

---

## Step 5: Report to User

Summarise what was captured:
- Sections populated (with key highlights)
- Sections still empty (prompt to capture later)
- Gaps or surprises found
- How this affects template specs (e.g., "Now that we know templates use dropdowns not free-text, the Template_Spec field types should be updated")

---

## Rules

- **Re-runnable.** Each run adds to or refines existing captures. Never overwrite — append or update
- **Structure everything.** Freeform input from user → structured output in tool_capture.md
- **Flag don't judge.** If a feature is missing, note it factually. Don't editorialise about whether it's good or bad
- **Cross-reference.** When capturing a feature, note which knowledge base items it maps to (e.g., "Report generation supports PDF output — maps to EICR format requirement in regulatory_standards.md")
- **Ask clarifying questions** if the user's description is ambiguous. Better to ask once than capture wrong
