You are running Deploy Plan — the synthesis step that produces the full deployment strategy for a client.

This is the key output. Everything prior (Client Intel, Constraint Map) feeds into this. The deployment plan is the artefact the DS owns and the client signs off on.

---

## Prerequisites
- Client file must exist with intelligence profile AND constraint map completed
- Read `/data/clients/[client_name].md` (full file)
- Read `/data/playbook/deployment_playbook.md` for similar client precedents
- Read `/data/system/method_registry.md` for approved deployment methods

---

## Step 1: Pull Playbook Precedents

Search the playbook for past clients with similar:
- Sector or inspection types
- Scale (inspector count, locations)
- Deployment stage or challenge profile

Surface: what worked, what failed, what to watch for. Reference specific clients and outcomes.

If no similar precedent exists, note it: "No direct precedent. This deployment breaks new ground in [area]."

---

## Step 2: Select Deployment Method

Based on all prior context, choose the deployment approach:

| Method | When to Use | Risk Level |
|--------|------------|------------|
| **Light-touch remote** | Client is tech-savvy, small user base, clear use case | Low |
| **On-site embedding** | Large enterprise, complex workflows, change management needed | Medium |
| **Phased rollout by user group** | Multiple user types, staged adoption preferred | Medium |
| **Hybrid (remote + on-site sprints)** | Geographic spread, budget constraints, but needs hands-on moments | Medium-High |

Provide: recommended method with rationale, and one fallback option if the primary doesn't work.

Factor in: client preference (from interaction history), geographic constraints, contract scope, past playbook results for this method.

---

## Step 3: Feature Sequencing

Define what goes live and when:

### Phase 1 — Foundation (Weeks 1-4)
| Feature | Purpose | Dependencies | Risk |
|---------|---------|-------------|------|
| | | | |

### Phase 2 — Core Value (Weeks 5-8)
| Feature | Purpose | Dependencies | Risk |
|---------|---------|-------------|------|
| | | | |

### Phase 3 — Expansion (Weeks 9-12+)
| Feature | Purpose | Dependencies | Risk |
|---------|---------|-------------|------|
| | | | |

Reference the wedge use case from Constraint Map. Phase 1 should deliver the wedge.

---

## Step 4: Timeline and Milestones

| Milestone | Target Date | Success Criteria | Gate Condition | Escalation Trigger |
|-----------|------------|-----------------|----------------|-------------------|
| Data ingestion complete | | | | |
| First feature live | | | | |
| User adoption threshold | | | | |
| Full deployment | | | | |
| First expansion review | | | | |

For each milestone:
- What must succeed for the engagement to continue?
- What triggers escalation if it's at risk?
- Who owns it?

---

## Step 5: Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|-----------|-------|
| | High/Med/Low | High/Med/Low | | |

Include at minimum:
- Adoption risk (users don't switch from current tools)
- Integration risk (data or system compatibility)
- Champion risk (internal sponsor leaves or loses influence)
- Scope creep (client requests exceed contract)
- Timeline risk (delays in data provision or approvals)

---

## Output

1. Update the client file `/data/clients/[client_name].md`:
   - **Deployment Plan section** — replace placeholder with the full plan (method, sequencing, timeline, risks)
   - **Deployment State** — update stage to "Planning Complete" or "Ready for Phase 1"
   - **Interaction History** — add entry: "[date] | Deploy_Plan | Deployment plan created. Method: [method]. Wedge: [feature]. Timeline: [duration]"

2. Also create a **standalone deployment plan document** at `/data/clients/[client_name]_deployment_plan.md` — this is the artefact that gets shared with the client. Clean, professional, no internal notes.

---

## After Completion

Tell the user: "Deployment plan complete for [client name]. Method: [method]. Phase 1 delivers [wedge use case] in [timeline]. [X] risks flagged."

Display the plan summary. Ask: "Ready to begin execution, or do you want to review and adjust?"
