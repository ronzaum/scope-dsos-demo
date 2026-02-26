You are running Client Intelligence — a deep research pass on a client company before any deployment work begins.

---

## Prerequisites
- A client file must exist at `/data/clients/[client_name].md`
- Read the client file first to see what context already exists

---

## Research Areas

Investigate the following. Use WebSearch and WebFetch where possible. For the demo, also reference any pre-loaded data in the client file.

### 1. Company Overview
- What do they do? Core business, revenue model, market position
- Size: employees, inspectors, locations, countries
- Recent news, funding, leadership changes

### 2. Inspection Operations
- What types of inspections do they perform?
- Which industries/sectors do they serve?
- What is their inspection volume? (estimates acceptable)
- What regulatory frameworks govern their work?

### 3. Current Tools & Processes
- What software/systems do they currently use for inspections?
- Manual processes still in place?
- Known pain points from public sources (reviews, case studies, job postings)

### 4. Decision-Makers
- Who leads operations, technology, quality?
- Who would own an AI inspection deployment internally?
- Any known champions or blockers?

### 5. Competitive Landscape
- Are they using any competitors? (SafetyCulture, Checkfirst, Lumiform, custom tools)
- What would switching from their current setup look like?

### 6. Commercial Context
- What is the estimated contract opportunity?
- What deployment scale makes sense? (number of inspectors, locations)
- What would success look like for them specifically?

### 7. Scope AI Fit
- Which Scope capabilities map to their needs?
- Where is the strongest initial fit?
- What would be the wedge use case (the first deployment that proves value)?

---

## Output

Update the client file `/data/clients/[client_name].md`:

1. **Profile section** — fill in all fields with researched data
2. **Add an "Intelligence Summary" subsection** under Profile with bullet-point findings from each research area above
3. **Stakeholder Map** — add any identified decision-makers
4. **Interaction History** — add entry: "[date] | Client_Intel | Intelligence profile completed. [key finding]"

Keep all findings concise and bullet-driven. Use the company's own language where possible. Flag anything that is estimated vs confirmed.

---

## After Completion

Tell the user: "Intelligence profile complete. Next step: run `/Constraint_Map` to map users, current tools, and product fit."

If any critical information is missing (e.g., no data on current inspection tools), flag it explicitly: "Gap: [what's missing]. This will need to be filled from the first client conversation."
