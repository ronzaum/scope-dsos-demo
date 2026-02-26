You are running the DS-OS entry point. This is the gateway to all deployment operations.

---

## Determine Mode

Ask the user which mode:

1. **New Client** — A company has contacted us or we are contacting them. No existing client file.
2. **Existing Client — Update** — A client we are already deploying to. New information, milestone, or expansion opportunity.
3. **Existing Client — Problem** — A client we are already deploying to. Something is wrong, stalled, or needs resolution.

If the user provides a client name or context that makes the mode obvious, do not ask. Proceed directly.

---

## Mode 1: New Client

1. Collect:
   - Company name
   - How they came in (inbound enquiry, BD outreach, referral, event)
   - Any initial context (email, transcript snippet, CRM note)
   - Contact person and their role

2. Create a new client file at `/data/clients/[company_name_lowercase].md` using this structure:

```markdown
# [Company Name]

## Profile
- **Sector:**
- **Size:** (employees, inspectors, locations)
- **Inspection types:**
- **Geography:**
- **Source:** [how they came in]
- **Initial contact:** [name, role]
- **Date created:** [today]

## Commercial
- **Contract status:** Scoping
- **Estimated value:** TBD
- **Timeline:** TBD
- **Economic buyer:** TBD
- **Success criteria:** TBD

## Deployment State
- **Stage:** Intake
- **Phase:** Pre-deployment
- **Features:** None
- **Users:** TBD
- **Adoption:** N/A

## Constraint Map
*Not yet completed. Run /Constraint_Map after /Client_Intel.*

## Deployment Plan
*Not yet created. Run /Deploy_Plan after /Constraint_Map.*

## Issue Log
No issues logged.

## Interaction History
| Date | Source | Summary |
|------|--------|---------|
| [today] | [source] | Client file created. [initial context] |

## Stakeholder Map
| Name | Role | Priority | Communication Style | Trust Level | Notes |
|------|------|----------|-------------------|-------------|-------|
| [contact] | [role] | Primary | TBD | New | Initial contact |

## Playbook Contributions
No contributions yet.
```

3. Confirm the client file is created. Tell the user: "Client file created. Next step: run `/Client_Intel` to build the intelligence profile."

---

## Mode 2: Existing Client — Update

1. Read the client file at `/data/clients/[client_name].md`
2. Display current state summary: stage, phase, last interaction, open issues, next milestone
3. Ask: "What's the update?" Accept: new information, milestone reached, expansion signal, commercial change, stakeholder change
4. Update the relevant section of the client file
5. Add a timestamped entry to Interaction History
6. If the update changes deployment state, update that section
7. Confirm what was updated. Suggest next command if relevant (e.g., if expansion signal → suggest reviewing deployment plan)

---

## Mode 3: Existing Client — Problem

1. Read the client file at `/data/clients/[client_name].md`
2. Display current state summary: stage, phase, open issues, recent interactions
3. Tell the user: "Problem noted. Run `/Log_Issue` to classify and log it, then `/Resolve` to find a solution."
4. If the user describes the problem immediately, proceed directly to logging it (follow `/Log_Issue` flow inline)

---

## Rules
- Always read the existing client file before making any changes (Modes 2 and 3)
- Never overwrite existing data. Add to it
- Every interaction gets a timestamped entry in Interaction History
- If a client file already exists for a "new" client, flag it and switch to Mode 2
