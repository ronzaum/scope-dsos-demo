# FE-019: TIC Playbook — Industry Reference Page

**Type:** Feature | **Priority:** High | **Effort:** Large

## TL;DR

New page: a rapid-access industry reference tool for DS. Pull it up mid-meeting, find what you need about TIC — inspection cycles, stakeholders, standards, report structure, product capabilities. Not a wiki, not a menu. Action-driven fast retrieval.

## Current State

- Knowledge lives in markdown files under `/data/knowledge/` — not exposed in the frontend
- No way for a DS to quickly look up industry reference material during a call or meeting
- The existing `/playbook` page covers deployment patterns and resolution — different purpose

## Expected Outcome

### Access
- New sidebar nav item (top-level, alongside Overview/Clients/Templates/Playbook)
- Persistent brain icon (top-right of every page) opens a Sheet side panel (compact mode) with "Open full page" link

### Page Layout — Reference Grid (Option B)
- Full-width search bar at top — keyword filter across all 7 sections, no LLM
- 7 section cards in responsive 3-col grid (2-col tablet, 1-col mobile)
- Each card: large white Lucide icon (centered), title, text-only preview of first 3-4 items
- Cards taller than typical dashboard cards — more visual weight
- Subtle differentiated backgrounds per card (not colourful — neutral tints)

### Expansion Behaviour
- Click a card → full-width detail panel opens below the card row (accordion-style)
- Card stays visible and highlighted above expanded content
- Multiple sections can be open simultaneously
- Items within expanded sections use a split layout: list on left, detail panel on right
- First item auto-selected when section expands
- Clicking a different item updates the right panel within that section

### 7 Sections

1. **Inspection Cycle** — One data-driven SVG flow diagram per inspection type (6 types). Click a step node → right panel shows step detail. Source: `inspection_types.md`
2. **Stakeholder Map** — All TIC client personas (8 defined). White Lucide icons per persona. Click → right panel with role description, success criteria, DS notes. Source: new content
3. **Regulatory Standards** — 8 standards, name only in list. Click → right panel with description, applications, roles involved, external web link. Source: `regulatory_standards.md`
4. **Inspection Types** — Icon list of 6 types. Click → right panel with full description (fields, instruments, common defects, deployment notes). Source: `inspection_types.md`
5. **Report Structure** — Data-driven SVG flow diagram (section titles connected by arrows). Click a section node → right panel with detail, field requirements, good vs bad examples. Source: `report_anatomy.md`
6. **Success Questions** — Question groups for customer conversations. Collapsible by group (Understanding Their Operation, Standards & Compliance, Pain & Friction, Data & Systems, Success & Value). Source: new content
7. **Scope Product** — Capability cards with metrics. Click → detail, claims, competitive context. Source: `scope_product.md`

### Side Panel Mode (Brain Icon)
- Sheet slides from right on any page
- Compact version: search bar + 7 accordion items (no cards, just list)
- "Open full page" link at top

### Data Architecture
- New API endpoints that parse knowledge base markdown files
- Same pattern as existing client/template endpoints
- React Query with auto-refetch for live sync

### SVG Diagrams
- Data-driven React components (not hand-crafted)
- Takes array of steps as props, renders connected nodes automatically
- Styled boxes with subtle backgrounds, rounded corners, monospace labels
- Clean connecting lines/arrows in existing colour system
- Reused for both Inspection Cycle (6 diagrams) and Report Structure (1 diagram)

### Stakeholder Personas

| Icon (Lucide) | Persona | One-liner |
|---------------|---------|-----------|
| Wrench | Inspector / Field Engineer | On-site data capture, findings, defect classification |
| ClipboardList | Operations / Planning Manager | Scheduling, workload, inspector assignment, coverage |
| CheckCircle | Compliance / QA Manager | Report review, regulatory adherence, audit trail |
| Search | Technical Reviewer / Approver | Sign-off on findings, classifications, recommendations |
| Settings | IT / Systems Administrator | Tools, integrations, data infrastructure, access |
| Briefcase | Commercial / Procurement | ROI, cost per inspection, contract terms |
| BarChart3 | Senior Leadership / Director | Throughput, risk, compliance rates, strategy |
| Factory | Client-side Asset Owner | Receives the report, needs clear actionable findings |

### Success Questions (Customer Conversation)

**Understanding Their Operation**
- Walk me through what happens from the moment an inspection is assigned to when the report is delivered?
- How many inspectors are in the field on a given day?
- What does your current reporting process look like — paper, Word, PDF, custom system?
- How long does a typical inspection take end-to-end, from assignment to final report?
- What happens when an inspector finds something critical on-site?

**Standards & Compliance**
- Which regulatory standards govern your inspections?
- How do you currently ensure reports meet those standards before submission?
- Has a report ever failed a compliance review? What happened?
- How do you handle the difference between advisory findings and mandatory actions?

**Pain & Friction**
- Where do things slow down the most in your current workflow?
- What's the most time-consuming part for your inspectors?
- When reports come back incomplete or inconsistent, what's the typical cause?
- How much rework happens between first draft and final approved report?

**Data & Systems**
- What systems do your inspectors currently use in the field?
- How does inspection data flow into your central systems today?
- Do you have existing templates or forms, and who maintains them?
- What does your data look like — structured fields, free text, photos, a mix?

**Success & Value**
- If this worked perfectly, what would change for your team in 6 months?
- How do you measure inspection efficiency today?
- What would make your compliance team's life easier?
- What has to be true for this to be worth the investment?

## Files

- `frontend/src/pages/Knowledge.tsx` — new page (to be created)
- `frontend/src/components/knowledge/` — new component directory (section cards, detail panels, SVG diagram component)
- `frontend/src/components/AppSidebar.tsx` — add nav item
- `frontend/src/components/Layout.tsx` — add brain icon button
- `frontend/src/App.tsx` — add route
- `api/server.js` — new `/api/knowledge/*` endpoints
- `data/knowledge/*.md` — existing data sources (read-only)

## Notes

- The page must feel different from other pages (reference tool, not ops dashboard) while staying consistent with the design system (same fonts, colours, components)
- SVG diagrams are the visual centrepiece — they need to be clean and strong
- Search is keyword match, not semantic — fast and simple
- Side panel (brain icon) is critical for the mid-meeting use case
