# GitHub Issue — Build DS-OS Demo

---

## Title: Build Scope AI DS-OS Demo — Deployment Strategy Operating System

## Labels: `demo`, `mvp`, `scope-ai`

---

## Summary

Build a working demo of DS-OS (Deployment Strategy Operating System) for Scope AI. The system runs client deployments as a structured, repeatable pipeline using Claude Code slash commands (backend) connected to a Lovable dashboard (frontend).

**Goal:** A Deployment OS that allows precision, scale, and knowledge retention across all created deployment strategies.

**Demo audience:** Jonathan Low, CEO of Scope AI. Call scheduled today.

---

## What to Build

### Backend (Cursor / Claude Code)

- [ ] **CLAUDE.md** — Project operating instructions with full Scope AI context, data model, command pipeline, role permissions
- [ ] **Slash commands (`.claude/commands/`):**
  - [ ] `Start.md` — Entry point: new client, existing update, or problem (3 modes)
  - [ ] `Client_Intel.md` — Deep company/client research and intelligence profile
  - [ ] `Constraint_Map.md` — User mapping + solutions audit + product match against Scope capabilities
  - [ ] `Deploy_Plan.md` — Synthesise full deployment plan from all prior context + playbook
  - [ ] `Log_Issue.md` — Problem intake, classification, severity, affected users
  - [ ] `Resolve.md` — Cross-client pattern scan + past solutions + action plan
  - [ ] `Update_Playbook.md` — Compound learnings into playbook after resolution or milestone
  - [ ] `Status.md` — Pull up any client's current state (display only)
  - [ ] `Pivot.md` — Universal method/rule change across all deployments
  - [ ] `System_Review.md` — Architecture audit and sync
- [ ] **Pre-loaded client data (`/data/clients/`):**
  - [ ] `bureau_veritas.md` — Active deployment, Phase 2, 3 months in, £250k contract
  - [ ] `intertek.md` — New inbound, intake stage, first meeting scheduled
  - [ ] `tuv_sud.md` — Problem state, adoption stalled, 5 months in
- [ ] **Playbook data (`/data/playbook/`):**
  - [ ] `deployment_playbook.md` — 5+ deployment patterns by client type
  - [ ] `resolution_patterns.md` — Issue types and proven solutions
  - [ ] `client_type_definitions.md` — Client segmentation rules
- [ ] **System data (`/data/system/`):**
  - [ ] `system_log.md` — System change history
  - [ ] `method_registry.md` — Current deployment methods and rules
  - [ ] `architecture.md` — System architecture doc

### Frontend (Lovable)

- [ ] **Page 1: Overview Dashboard** — Active deployments table, stat cards, signal feed
- [ ] **Page 2: Client Detail View** — Full client state with role-based edit permissions
- [ ] **Page 3: Command Terminal** — Animated terminal showing slash commands running
- [ ] **Page 4: Playbook & Learnings** — Patterns, methods, cross-client insights

### Design System (Lovable)
- Dark background (#0a0a0a), clean surfaces, electric blue accent (#3b82f6)
- No gradients, no illustrations, no rounded-everything
- Monospace for terminal/data elements
- Linear/Vercel dashboard aesthetic
- Role-based UI: editor capabilities are role-selected, not universal

---

## Demo Scenarios to Validate

1. **New client pipeline:** `/Start (new: Intertek)` → `/Client_Intel` → `/Constraint_Map` → `/Deploy_Plan` — produces a full deployment strategy from scratch
2. **Problem resolution:** `/Start (problem: TÜV SÜD)` → `/Log_Issue` → `/Resolve` → `/Update_Playbook` — resolves an issue and compounds the learning
3. **Client status:** `/Status (Bureau Veritas)` — pulls up full deployment state instantly
4. **Method pivot:** `/Pivot` — changes a deployment method universally, shows affected clients

---

## Architecture Notes

- **Data model:** Markdown files as database. One file per client. Playbook and system files separate
- **Two halves:** Deployment operations (client pipeline) + System operations (internal maintenance)
- **Pipeline is fixed, customisation is per-step:** Same sequence for every client. The variation lives inside each command's output, not across the process
- **Knowledge compounding:** Every resolution and milestone feeds the playbook. Cross-client pattern scanning surfaces what worked elsewhere
- **Cursor ↔ Lovable:** For demo, shown side by side. Same data model in both. "In production, these sync automatically"

---

## Acceptance Criteria

- [ ] Can run Scenario 1 end-to-end: new client → full deployment plan
- [ ] Can run Scenario 2 end-to-end: problem → resolution → playbook update
- [ ] Can show any client's state with `/Status`
- [ ] Can demonstrate `/Pivot` changing methods across clients
- [ ] Lovable dashboard reflects the same data shown in terminal
- [ ] Pre-loaded data feels real (simulated history, resolved issues, playbook entries)
- [ ] System is clearly structured for scale, not hacked together for one demo

---

## Context

- Scope AI: AI inspection automation for TIC industry, 8x YoY growth, 7 of top 10 TIC clients, raising Series A
- The DS-OS demonstrates how deployment operations would run as a system, not as individual heroics
- North star: precision + scale + knowledge retention
- This is a demo, not production. But the architecture is real and the data model works
