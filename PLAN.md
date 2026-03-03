# DS-OS Extension — Implementation Plan

**Overall Progress:** `100%`

## TLDR

Extend the DS-OS with a templating layer, knowledge base, and Friday trial infrastructure. The system must handle templating, strategy, and anything else Friday throws at Ron. Two-layer knowledge model: factual industry knowledge built now (Layer 1), Scope's tool mechanics captured on arrival (Layer 2). Commands are clearly separated into 5 categories so workflows never get confused. A4 cheatsheet for quick reference all day.

## Critical Decisions

- **4 consolidated knowledge files, not 12:** Same depth, faster to navigate mid-trial. One file per topic with scannable headers.
- **Two-layer knowledge model:** Layer 1 (standards, inspection types, report structures) built now. Layer 2 (Scope's tool) captured Friday via `/Tool_Setup`. Commands work with Layer 1 from minute 1, get sharper with Layer 2.
- **Keep full DS-OS:** Friday could be templating, outreach, or strategy. Don't narrow. Strategy commands stay as a live category.
- **Stay in Cursor/Claude Code:** No app. The value is workflow speed, not a UI.
- **Pre-loaded example template:** One complete pressure vessel spec as reference pattern. Tool-agnostic until Friday.
- **5 command categories:** Setup / Templating / Strategy / System / Anytime. Clear separation prevents workflow confusion.

## Tasks

- [x] 🟩 **Step 1: Research — Scope product + TIC industry + standards**
  - [x] 🟩 Deep web research on Scope AI (getscope.ai, LinkedIn, press, case studies)
  - [x] 🟩 Research TIC inspection types (pressure vessel, lifting equipment, electrical, NDT, factory audit, fire safety)
  - [x] 🟩 Research regulatory standards (API 510, LOLER, BS 7671, ISO 17020, PED, PUWER)
  - [x] 🟩 Research TIC report structures and anatomy

- [x] 🟩 **Step 2: Knowledge base — write 4 files under `/data/knowledge/`**
  - [x] 🟩 `scope_product.md` — Scope's public product info, features, claims
  - [x] 🟩 `inspection_types.md` — all inspection types in one file (process, fields, instruments, report structure, standard)
  - [x] 🟩 `regulatory_standards.md` — all standards in one file (governs, classification system, report requirements)
  - [x] 🟩 `report_anatomy.md` — universal TIC report skeleton, variations by type, good vs bad

- [x] 🟩 **Step 3: Friday infrastructure — context files + template library**
  - [x] 🟩 Create `/data/friday/tool_capture.md` — empty structured template for Layer 2 capture
  - [x] 🟩 Create `/data/friday/trial_log.md` — empty running log
  - [x] 🟩 Create `/data/templates/_template_index.md` — template index (starts with example)
  - [x] 🟩 Create `/data/templates/example_pressure_vessel_api510.md` — pre-loaded example template spec

- [x] 🟩 **Step 4: Setup commands**
  - [x] 🟩 `commands/Friday_Context.md` — trial day entry point, capture situation, load knowledge, set eval awareness
  - [x] 🟩 `commands/Tool_Setup.md` — capture Scope's tool mechanics, structure freeform input, flag gaps, re-runnable

- [x] 🟩 **Step 5: Templating commands**
  - [x] 🟩 `commands/Template_Spec.md` — main work command, inspection type + context → structured spec, reads knowledge + tool capture, flags overlaps
  - [x] 🟩 `commands/Report_Map.md` — analyse customer's existing report, map structure, feeds into Template_Spec
  - [x] 🟩 `commands/Template_QA.md` — quality check template spec (fields, classification, structure, mapping completeness)
  - [x] 🟩 `commands/Pattern_Check.md` — scan template library for overlaps and reusable elements, scalability signal

- [x] 🟩 **Step 6: Anytime command**
  - [x] 🟩 `commands/Ask_Right.md` — contextual question generator, works across all workflows

- [x] 🟩 **Step 7: Update CLAUDE.md**
  - [x] 🟩 Add command categories (5 groups, clearly labelled)
  - [x] 🟩 Add knowledge base rules (Layer 1 vs Layer 2)
  - [x] 🟩 Add template library rules (every spec to `/data/templates/`, index always updated)

- [x] 🟩 **Step 8: Friday cheatsheet**
  - [x] 🟩 Write `/data/friday/FRIDAY_CHEATSHEET.md` — single A4 scannable reference, all workflows, all commands, built last so it reflects reality
