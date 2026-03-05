# FE-012: Pattern Detection Redesign — Visual Grid + Core Blocks

**Type:** Feature | **Priority:** High | **Effort:** Large

## TL;DR
Redesign the Pattern Detection section from text-heavy cards into a visual-first heatmap grid with collapsible details and an actionable core block extraction system. The grid shows sections × templates, dot intensity = match strength, hover for detail. Core blocks make pattern detection the scalability engine — not decoration.

## Current State
- Pattern Detection renders three cards: Overlap Map, Reusable Elements, Scalability Signals
- All detail shown upfront — hard to digest at a glance
- No visual representation of patterns across the template library
- No way to compare specific templates against each other
- Purely informational — nothing actionable. Looks like decoration
- No mechanism to extract shared patterns into reusable blocks for new templates

## Expected Outcome

### 1. Visual Pattern Grid (hero view)
- Heatmap matrix: sections (rows) × templates (columns)
- Dot/cell intensity indicates match strength (identical → similar → no match)
- Hover/toggle on a cell reveals actual field matches
- Template multi-select filter above grid: compare specific templates or compare all
- Templates grouped by inspection family (pressure, pipeline, electrical, etc.) as library grows
- Lightweight, scannable at a glance — detail on demand

### 2. Collapsible Details (secondary)
- Current three cards (Overlap Map, Reusable Elements, Scalability Signals) become accordion/dropdowns below the grid
- Collapsed by default — grid is the primary view
- All existing detail preserved, just tucked away

### 3. Core Block Extraction (actionable)
- DS selects rows in the grid that are consistently matched across templates
- Extract selected sections as a shared "core block"
- New templates created via `/Template_Spec` inherit from core blocks automatically — DS only fills the gaps
- When a core block is updated, affected templates get flagged for review ("core block changed — review these N templates")
- No auto-push — DS confirms propagation (flag-and-review pattern)

### 4. Permissions
- DS: full operation (view grid, extract core blocks, manage propagation)
- All other roles: read-only view of the grid and details

## Files

**Modified files:**
- `frontend/src/components/PatternDetection.tsx` — full redesign: grid component, collapsible details, core block UI
- `frontend/src/pages/Templates.tsx` — integrate redesigned PatternDetection
- `api/server.js` — new endpoints for core block CRUD + propagation flagging
- `api/parsers/template.js` — parse/write core block data
- `data/templates/_pattern_analysis.md` — extend format to include core block definitions
- `data/templates/_template_index.md` — reflect core block inheritance per template

**Potentially new files:**
- `frontend/src/components/PatternGrid.tsx` — heatmap grid component (may warrant its own file)
- `frontend/src/components/CoreBlockManager.tsx` — core block extraction + propagation review UI
- `data/templates/_core_blocks.md` — core block definitions (shared sections with field specs)
- `api/parsers/coreblock.js` — core block parser if complexity warrants separation

## Notes
- Grid must stay performant as template count grows — grouping by inspection family is the scaling mechanism
- Core block propagation uses flag-and-review, not auto-push — aligns with DS-OS "confirm before applying" principle
- The `/Pattern_Check` command should be updated to detect and suggest core block candidates
- This is the scalability engine alongside the playbook — templates begin to create each other as the library grows
