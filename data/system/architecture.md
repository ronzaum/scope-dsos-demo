# DS-OS Architecture
# Scope AI — Deployment Strategy Operating System
# Last Updated: 2026-02-20

---

## Purpose

A Deployment OS that allows precision, scale, and knowledge retention across all deployment strategies at Scope AI.

## Design Principles

1. **Pipeline is fixed, customisation is per-step.** Every client goes through the same sequence. The variation lives inside each command's output, not across the process
2. **Files are the database.** All state lives in markdown. No external dependencies. Portable, version-controlled, human-readable
3. **Knowledge compounds.** Every deployment makes the next one better. Playbook grows from every resolved issue and milestone
4. **Two halves.** Deployment operations (client-facing) and system operations (internal maintenance) are separate concerns with separate commands
5. **Confirmation before system changes.** /Pivot and /System_Review show diffs and wait for approval. No silent auto-edits
6. **Role-based access.** Not everyone edits. Editor capabilities are selected per role

## Command Pipeline

### Deployment Operations
`/Start` → `/Client_Intel` → `/Constraint_Map` → `/Deploy_Plan`
`/Start (problem)` → `/Log_Issue` → `/Resolve` → `/Update_Playbook`
`/Status` — read-only, any time

### System Operations
`/Pivot` — universal method/rule changes
`/System_Review` — architecture audit
`/Explore` — investigate without implementing

## Data Structure

```
/data/clients/[name].md     — one file per client, single source of truth
/data/playbook/*.md          — institutional memory (patterns, methods, segmentation)
/data/system/*.md            — system state (methods, logs, architecture)
```

## Current State

- **Clients:** 3 (Bureau Veritas: active-healthy, TÜV SÜD: active-at-risk, Intertek: intake)
- **Playbook entries:** 4 deployment patterns, 4 resolution patterns
- **Operational rules:** 4 (R-001 through R-004)
- **Deployment methods:** 4 (M-001 through M-004, M-002 restricted)
- **Pivots executed:** 3 (all from TÜV SÜD learnings)
