# Changelog

## Unreleased

### Added

- **FE-015 / RON-20 — Deploy DS-OS as a Shareable URL**
  - **Static serving:** `api/server.js` — Express serves `frontend/dist/` via `express.static()` with catch-all `*` route for React Router client-side routing. Single process serves both API and frontend
  - **Password gate:** `AccessGate.tsx` — full-screen access code prompt (`complianceismypassion`). Uses `sessionStorage` so it persists per tab. Wraps `<AuthProvider>` in `App.tsx` — no API calls fire until code is entered
  - **Production env:** `frontend/.env.production` with `VITE_API_BASE=` (empty string for same-origin). Changed `||` to `??` in `AuthContext.tsx`, `Templates.tsx`, `CoreBlockManager.tsx` so empty string isn't treated as falsy
  - **Render config:** `render.yaml` — single web service, build command (frontend install + build, then API install), `NODE_ENV=production`, auto-generated `DSOS_JWT_SECRET`
  - **Client data un-gitignored:** `/data/clients/` removed from `.gitignore` — all 3 client files carry simulated data disclaimer banners

### Changed

- **FE-023 — Rename Playbook to Field Notes, move client types to TIC Playbook**
  - **Sidebar:** "Playbook" nav item renamed to "Field Notes" with Footprints icon, route changed from `/playbook` to `/field-notes`
  - **Field Notes page:** Removed Operational Rules and Cross-Client chart sections. Added Metrics Benchmarks table (Bureau Veritas Month 3, TÜV SÜD Month 5, Target columns). Pattern cards now show source client links and last-updated timestamps
  - **TIC Playbook:** New `ClientSegmentationSection` component added to Knowledge page. Client type definitions (enterprise, mid-market segmentation rules) moved from `/api/playbook` response into `/api/knowledge` as a new section. `SectionExpansion.tsx` updated with new section routing
  - **API:** `buildKnowledgeResponse()` extended to parse client type data from playbook file. `/api/playbook` response no longer includes client type definitions. Fallback data updated for both endpoints

- **FE-024 / RON-33 - UI Cleanup: Logo, Boilerplate, Em Dashes**
  - **Scope logo added to sidebar** - `AppSidebar.tsx` now shows Scope logo (white ring mark) next to "DS-OS" text when expanded, logo-only when collapsed. Logo at `frontend/public/logo_scope.png`
  - **index.html cleaned up** - Title fixed to "Scope Deployment OS". Removed all Lovable meta tags (description, author, OG image, Twitter card/site), removed TODO comments
  - **Em dashes removed from all UI strings** - Replaced " — " with " - " across 7 component files (`Knowledge.tsx`, `Playbook.tsx`, `Templates.tsx`, `InspectionCycleSection.tsx`, `CoreBlockManager.tsx`) and 2 data files (`fallbacks.ts`, `clients.ts`). ~51 occurrences. Code comments left unchanged

### Removed

- `frontend/src/App.css` - Unused Vite scaffold boilerplate (`.logo`, `.card`, `.read-the-docs` classes)
- `frontend/src/pages/Index.tsx` - Default Lovable placeholder page ("Welcome to Your Blank App"), not routed

### Added

- **FE-021 / RON-30 — Commercial Action Layer**
  - **Groups A+B (Data & API):**
    - **Client schemas:** Added `Pipeline stage:` field to all 3 client files (BV: Active, Intertek: Prospect, TÜV: Active). Added `Adoption by type:` sub-bullets to BV (3 types) and TÜV (2 types). Standardised Intertek's `Expansion potential:` to `£500,000`
    - **Client parser:** `parseCommercial()` now extracts `pipelineStage`, `expansionPotentialValue` (numeric), `renewalDateParsed` (ISO), `adoptionTarget` (from success criteria %). `parseDeploymentState()` extracts `adoptionByType` array (`{ type, percent, active, total }`). `buildClientSummary()` includes `pipelineStage`, `renewalDate`, `expansionPotential`, `adoptionTarget`
    - **Commercial engine:** New `api/parsers/commercial.js` — `computeRevenueAtRisk()` (renewal <90d + adoption gap OR blocking issues), `computePendingAdoption()` (inactive users across active deployments), `computeUrgencyScore()` (weighted: renewal proximity, adoption gap, blocking issues, champion risk), `generateProposedAction()` (hard rules + playbook pattern matching), `estimateEffort()`, `buildPriorityQueue()` (urgency-sorted with actions)
    - **Overview API:** `/api/overview` now returns `revenueAtRisk` and `pendingAdoption` stats (replacing `inspectionImprovement` and `playbookEntries`), plus `priorityQueue` array. Playbook resolution patterns wired for precedent matching
    - **Signal feed:** 3 new commercial signal types in `buildSignalFeed()` — renewal proximity (<90d), expansion criteria met (adoption >= target + no blockers), low-adoption-by-type (>10% below client average). Dated today so they sort to top
  - **Group C (Frontend — Overview):**
    - **PriorityQueue component** (`frontend/src/components/PriorityQueue.tsx`) — ranked client list between stat cards and health chart. Each row: clickable client name, urgency badge (red/amber/green), blocking text, proposed action, effort pill (color-coded). Factors shown as subtle sub-text. Empty state: "All clients on track" with green indicator
    - **Stat cards replaced** — "Inspection Improvement" → "Revenue at Risk" (£Xk format, AlertTriangle icon). "Playbook Entries" → "Pending Adoption" (user count, Users icon)
    - **Commercial signal icons** — `renewal: "🔄"`, `expansion: "📈"`, `commercial: "💰"` added to signal icon map
    - **Fallback data** — `FALLBACK_OVERVIEW.stats` updated with `revenueAtRisk`/`pendingAdoption` (removed `inspectionImprovement`/`playbookEntries`). `priorityQueue` array added with 3 demo entries
  - **Group D (Template Revenue Context):**
    - **Revenue mapping** — `buildTemplateRevenueContext()` in `api/parsers/commercial.js`: fuzzy-matches template `inspectionType` keywords against client `featuresLive` text. Returns per-template map of matched clients with contract value, user count, adoption %
    - **Template API** — `/api/templates` and `/api/templates/:slug` now include `revenueContext: { clients: [...] } | null` per template
    - **TemplateRevenueContext component** (`frontend/src/components/knowledge/TemplateRevenueContext.tsx`) — subtle bar above template detail showing covered clients with name, user count, £ARR, adoption %. Hidden when no client match. Wired into TemplateDetail in Templates.tsx

### Added

- **KB-022 / RON-31 — Regulatory Standards: Examples for All 8 Standards**
  - **Knowledge base:** Added `### Examples` subsection to all 8 standards in `data/knowledge/regulatory_standards.md`. Each includes a real-world inspection scenario (~150 words) and a formatted report excerpt (~10-15 lines) with standard-specific quantitative data
  - **Parser:** Added `reportExcerpts: string[]` field to `STANDARD_EXAMPLES` in `api/parsers/knowledge.js` for all 8 standards. `parseRegulatoryStandards()` now passes `reportExcerpts` through to the API response
  - **Frontend:** Added `reportExcerpts` to `Standard` interface in `RegulatoryStandardsSection.tsx`. Report excerpts render as monospace `<pre>` blocks (`bg-secondary/50`, `font-mono`, `whitespace-pre-wrap`) below worked examples and scenarios
  - **Fallbacks:** All 8 standards in `FALLBACK_KNOWLEDGE` (`fallbacks.ts`) now include populated `workedExamples`, `scenarios`, and `reportExcerpts` arrays (previously only API 510 had content; other 7 had empty arrays)

### Changed

- **FE-021 / RON-29 — TIC Playbook: Polish & Content Gaps**
  - **Inspection Types merged into Inspection Cycle:** `buildKnowledgeResponse()` now includes `description`, `keyFields`, `instruments`, `commonDefects`, `deploymentNotes` in the `inspection-cycle` section data. Standalone `inspection-types` section removed — 7 sections reduced to 6
  - **Process step examples fixed:** `PROCESS_STEP_EXAMPLES` keys rewritten to match actual step labels from `parseProcessFlow()`. Added examples for all previously missing steps across Lifting, Electrical, Factory Audit, and Fire Safety types (~25 new examples). Old keys (e.g. "Visual Check", "Testing", "Document Review") replaced with correct labels (e.g. "Visual examination", "Live testing", "Preparation")
  - **Uniform card sizing:** `SectionCard` button now uses `h-48 overflow-hidden` for consistent dimensions. Loading skeleton updated to 6 cards
  - **Text contrast on cards:** Icon opacity changed from `text-foreground/80` to `text-foreground`. Description changed from `text-muted-foreground` to `text-foreground/90`
  - **Inspection Cycle section enriched:** `InspectionCycleSection.tsx` right panel now renders type metadata below step detail — description, key fields (tags), instruments (list), common defects (top 5), deployment notes. Search filter extended to include new fields
  - **Report Structure examples inlined:** `showExamples` toggle removed from `ReportStructureSection.tsx`. Good/bad examples now render directly below note section
  - **Cleanup:** `InspectionTypesSection.tsx` deleted. `inspection-types` case removed from `SectionExpansion.tsx` and `MiniPreview.tsx`. TINTS redistributed to 6 blue shades. Fallback data updated with type metadata on `inspection-cycle` entries and `inspection-types` section removed

### Added

- **FE-020 / RON-27 — TIC Playbook: UX Overhaul & Content Enrichment**
  - **Group A (Data Enrichment):** `api/parsers/knowledge.js` — `parseProcessFlow()` now enriches each step with an `examples` array via `PROCESS_STEP_EXAMPLES` lookup (1-3 generic scenarios per step across all 6 inspection types, ~40 steps covered). `parseRegulatoryStandards()` adds `workedExamples` (quantitative) and `scenarios` (qualitative) arrays per standard via `STANDARD_EXAMPLES`. `parseReportSkeleton()` adds `goodExample` and `badExample` strings per section via `REPORT_SECTION_EXAMPLES` (all 7 sections covered). `parseCapabilities()` adds `maturity` field ("Live"/"Beta"/"Planned") per capability via `CAPABILITY_MATURITY` map. New `aggregateClientMetrics(clientsMap)` function computes `totalActiveUsers`, `avgAdoptionRate`, `productMaturity` from client cache. `buildKnowledgeResponse()` now accepts optional `clientsMap` param, injects `heroMetrics` into scope-product section data
  - **Group A (Server):** `api/server.js` — `loadAllData()` and `reloadFile()` now pass `cache.clients` to `buildKnowledgeResponse()` so hero metrics recompute on client file changes
  - **Group B (Layout):** `Knowledge.tsx` — replaced `expandedSections: Set<string>` with `expandedSection: string | null`. Layout switches between full-width 4-col card grid (nothing selected) and 40/60 split (cards left, `SectionExpansion` right with `lg:sticky`). Removed "expansion panels below card rows" rendering
  - **Group B (Cards):** `SectionCard.tsx` — `TINTS` replaced with 7 blue shades (`bg-blue-400/5` through `bg-blue-950/5`). Removed `getPreviewItems()` and bullet list. Cards now render `MiniPreview` component
  - **Group B (Mini Previews):** New `MiniPreview.tsx` — section-specific visual previews: SVG flow line (inspection cycle), SVG org chart (stakeholders), SVG section stack (report structure), stat badges with Lucide icons (standards: "8 standards", types: "6 types", questions: dynamic count, product: "45% faster")
  - **Group C (Section Content):** New `ExampleBox.tsx` — reusable callout component (blue-tinted bg, left border accent). `InspectionCycleSection.tsx` renders `ExampleBox` below step detail. `RegulatoryStandardsSection.tsx` renders "Worked Examples" and "Real-World Scenarios" subsections via `ExampleBox`. `ReportStructureSection.tsx` adds "Show/Hide Examples" toggle with green-tinted good example and red-tinted bad example callouts (defaults off, resets on section change). `ScopeProductSection.tsx` adds 3 hero metric cards (Adoption Rate, Active Users, Product Stage) above capability list, plus color-coded maturity badges ("Live" green, "Beta" amber, "Planned" grey) on each capability row and in detail panel
  - **Fallback Data:** `fallbacks.ts` updated — process steps include `examples` arrays, standards include `workedExamples`/`scenarios`, skeleton sections include `goodExample`/`badExample`, capabilities include `maturity`, scope-product includes `heroMetrics`

- **FE-019 / RON-26 — TIC Playbook: Industry Reference Page + Brain Icon Side Panel**
  - **Group A (API Layer):** `api/parsers/knowledge.js` — parses 4 knowledge base markdown files (`inspection_types.md`, `regulatory_standards.md`, `report_anatomy.md`, `scope_product.md`) into structured JSON. Embeds 8 stakeholder personas and 5 success question groups as data-only sections. `buildKnowledgeResponse()` orchestrates all parsers into 7-section response. Reuses `splitSections()`, `parseKeyValueBullets()`, `parseTable()` from `api/parsers/utils.js`
  - **Group A (API Layer):** `GET /api/knowledge` (full 7-section response) and `GET /api/knowledge/:section` (single section by slug) endpoints. Knowledge cache integrated into `loadAllData()` with file watcher on `data/knowledge/*.md`
  - **Group B (Frontend Foundation):** `/knowledge` route, "TIC Playbook" sidebar nav item (Brain icon), `Knowledge.tsx` page with full-width search (debounced 300ms), responsive 3-col card grid, multiple-open expansion panels
  - **Group B (Frontend Foundation):** `SectionCard.tsx` — tall card with centered Lucide icon, title, description, 4-item text preview, per-section neutral tint backgrounds. `SectionExpansion.tsx` — routes to section-specific components by ID
  - **Group C (Section Components + SVG):** `FlowDiagram.tsx` — data-driven SVG flow diagram: horizontal connected nodes, click-to-select, responsive auto-sizing viewBox, wraps on overflow
  - **Group C (Section Components + SVG):** 7 section components — Inspection Cycle (type selector + flow diagram), Stakeholder Map (persona list + role/talking points/friction detail), Regulatory Standards (clickable rows + detail + external links), Inspection Types (list + fields/instruments/defects), Report Structure (flow diagram of 7-section skeleton + field requirements), Success Questions (collapsible groups + question lists), Scope Product (capabilities + metrics + competitive context). All with left-list/right-detail split pane and search filtering (dimmed cards for zero matches, hidden items within expanded sections)
  - **Group D (Brain Icon Side Panel):** Persistent `Brain` icon button in `Layout.tsx` top-right (next to theme toggle), visible on every page. Opens `KnowledgePanel.tsx` — right-side `Sheet` with search bar, 7 sections as compact accordion (icon + title + item count), click-to-expand item lists with inline detail on selection. "Open full page" link navigates to `/knowledge` and closes Sheet. State resets on close
  - **Group D (Fallback Data):** `FALLBACK_KNOWLEDGE` in `frontend/src/data/fallbacks.ts` — full structured data for all 7 sections (inspection cycles with process flows, 8 stakeholders, 8 standards with external links, 6 inspection types with fields/instruments, 7-section report skeleton, 5 question groups, 8 product capabilities with metrics and competitors). `Knowledge.tsx` imports shared fallback instead of inline minimal stub

- **FE-013 — Confidence Indicators UX: Request Edit to Linear, Problem Tooltips, Batch Review**
  - **Backend:** `deriveSectionMeta()` in `api/parsers/template.js` — generates `problem` (<=10 words), `recommendedFix`, `successCriteria` per section from confidence level + reason text. All three fields now included in section objects returned by `GET /api/templates` and `GET /api/templates/:slug`
  - **Backend:** `POST /api/templates/:slug/request-edit` rewritten — accepts batch payload `{ templateName, sections[] }`, creates one Linear issue via GraphQL API (team RON, project DS-OS, label "Template Fix", assigned to Ron Zaum), keeps local JSON backup. Returns `{ id, linearIssueId, linearUrl }`
  - **Backend:** `ensureLinearLabel()` helper — finds or creates a named label on the Linear team
  - **Backend:** `dotenv` added, `api/.env` created (gitignored) with `LINEAR_API_KEY`
  - **Frontend:** Per-chip edit buttons removed. Single "Request Edit" button (orange accent) next to Generate/Regenerate, visible only when template has non-green sections
  - **Frontend:** Review modal — Dialog listing all flagged sections with editable Problem, Recommended Fix, Success Criteria, and Comment fields. Pre-filled from API data. "Send to Linear" confirm button
  - **Frontend:** Tooltips updated — non-green sections show `problem` text (orange for inferred, amber for industry standard). Green sections show "Verified — [reason]"
  - **Frontend:** Post-send state — button shows "Edit Requested" (muted/disabled) after successful send, resets on template regeneration
  - **Frontend:** `TemplateSection` interface extended with `problem`, `recommendedFix`, `successCriteria` fields
  - **Data:** `pipeline_api570.md` — added `| reason` text to 6 non-green sections (Methodology, Visual Findings, CUI, Conclusions, Appendices, Config Notes)

- **RON-17 — Pattern Detection Redesign: Visual Grid + Core Blocks**
  - **Group A (API + Data Layer):**
    - `api/parsers/template.js` — new template parser with `parseGridData()` (sections × templates cross-reference, match levels: identical/near-identical/similar/unique/none), `parseCoreBlocks()` / `writeCoreBlocks()` for core block CRUD, `deriveInspectionFamily()` for grid column grouping, section name normalisation with synonym mapping
    - `GET /api/templates/patterns` extended — returns `grid` payload alongside existing `overlaps`, `reusableElements`, `scalabilitySignals`
    - Core block CRUD: `GET /api/templates/core-blocks`, `POST` (DS-only, creates block from selected sections), `PUT /:name` (DS-only, updates block + flags affected templates for review), `DELETE /:name` (DS-only)
    - `data/templates/_core_blocks.md` — markdown-based storage for extracted core blocks
    - `data/templates/_pattern_analysis.md` — generated pattern analysis data
    - `data/templates/pipeline_api570.md` — second template spec enabling cross-template pattern detection
    - File watcher for `_core_blocks.md` added to existing template cache watcher
  - **Group B (Frontend Grid + Collapsible Details):**
    - `PatternGrid.tsx` — mosaic heatmap component: sections (rows) × templates (columns) as 28px filled squares with 3px gaps. Red→grey→blue gradient color scale (identical/near-identical/similar/none/unique). Cursor-following tooltip on hover shows matched fields. Template multi-select filter chips. Columns grouped by inspection family with extra gap separator. Legend with square swatches
    - `PatternDetection.tsx` refactored — grid mounted as hero element; Overlap Map, Reusable Elements, Scalability Signals collapsed into `Accordion` components (collapsed by default, show item counts)
  - **Group C (Core Block Extraction UI):**
    - PatternGrid row selection — DS can checkbox sections, selection bar appears with count + "Extract Core Block" button
    - Extraction dialog — name the block, preview selected sections, POST to API. Grid marks rows belonging to existing core blocks with block icon
    - `CoreBlockManager.tsx` — lists all core blocks with fields, linked templates, pending review flags (amber "Core block changed — review" badge). DS can approve/dismiss propagation per template, delete blocks. Mounted below PatternDetection on Templates page

- **RON-16 — Template section confidence indicators** (Group A: data layer)
  - Template spec headings now support `| reason` suffix after the confidence tag (e.g., `` `🟢 Regulatory` | API 510 Section 6 mandates... ``)
  - Template parser returns sections as structured objects: `{ name, confidence, confidenceLabel, reason }` instead of flat strings
  - Example pressure vessel spec updated with per-section reasons for all 11 tagged headings
  - Both `GET /api/templates` and `GET /api/templates/:slug` return structured section data

- **BE-010 — Template Report Generator** — Full pipeline: template spec → PPTX + PDF reports, viewable in frontend, downloadable via API
  - **Groups A + B (Verify & Build):** Generators produce editable PPTX (via `pptxgenjs`) and previewable PDF (via `pdfkit`). Swappable theme config. Knowledge base verified against public regulatory sources. Confidence tags added to template spec
  - `api/generators/pptx.js` — 10 slide types: cover (disclaimer banner), scope, methodology, thickness survey (auto-paginated data table with RAG coloring), visual findings (one per slide with photo placeholder), safety devices, FFS, conclusions, declarations, appendices. Auto-calculates corrosion rates, remaining life, anomaly flags from raw TML data
  - `api/generators/pdf.js` — A4 continuous-page (40 pages). PDFKit direct generation. RAG-colored tables, page numbers, watermark
  - `api/generators/themes/default.json` — 17 color tokens, fonts, RAG palette, finding layout mode, logo slot, photo placeholder sizing
  - `api/generators/sample-data/pressure_vessel_sample.json` — 21 TMLs, 5 findings, 4 safety devices, FFS assessment. Disclaimer metadata embedded
  - **Group C (Integrate & Ship):**
  - `POST /api/templates/:slug/generate` — accepts `format` query (`pptx`, `pdf`, `both`). Generates files to `/data/outputs/[slug]/`. Inline RBAC: DS + FDE only
  - `GET /api/templates/:slug/output` — lists generated files with sizes. `GET .../output/:filename` serves files (attachment or `?inline=true` for PDF preview)
  - `/Template_Generate` slash command — reads template context, calls generate API, confirms output. Fits pipeline: `/Template_Spec` → `/Template_QA` → `/Template_Generate` → `/Pattern_Check`
  - Frontend: "Generate Report" button + status indicator (generating/ready/error) on template detail. PDF preview via embedded iframe (blob URL). PPTX + PDF download buttons with file sizes. Template list shows "PPTX + PDF" badge for templates with generated outputs
  - `AuthContext` extended with `apiPost` (POST requests) and `apiDownload` (blob-based file download)

- **FE-008 — Dark / Light mode toggle** — Sun/Moon icon button (top-right of every page) toggles between dark and light themes. Preference persisted in `localStorage`. New `ThemeContext` + `ThemeProvider` wrapping the app. Light-mode CSS variables added to `:root`; original dark palette moved to `.dark` block. Scrollbar colours respond to theme
- **FE-009 — "This Week at a Glance" card** — Single visually distinct card (`bg-primary/5`, `border-primary/20`) at the top of the Overview page. Two-column layout: priorities (left) and today's notifications + recent changes (right). Emoji prefixes on every item for quick scanning. Falls back to static data when the API doesn't include `weekAtAGlance`. Includes loading skeleton
- **Frontend application** — Full React + TypeScript + Vite frontend (`frontend/`). Pages: Overview (dashboard with stat cards, deployment table, signal feed, health distribution chart), Client List (card grid of all clients), Client Detail (6-tab view: overview, constraint map, deployment plan, issues, interactions, stakeholders), Templates, Playbook. Built with shadcn/ui, Tailwind, React Router, React Query (30s polling). Auto-authenticates as DS role via silent login
- **Client list page** (FE-005) — `/clients` route with responsive card grid showing all clients. Each card displays name, sector, stage badge, health indicator, contract value, users, adoption bar, and issue count. Sidebar now links to list instead of hardcoded Bureau Veritas. Detail page has back navigation
- **Template API endpoints** — `GET /api/templates` (list), `GET /api/templates/:slug` (detail), `GET /api/templates/patterns` (pattern analysis). Template parser reads from `/data/templates/`. Cache auto-refreshes on file changes via chokidar watcher
- **Template RBAC** — DS: full access (list, detail, patterns). FDE: list + detail. Leadership: list only. AE/View Only: no access
- **Issue tracker** — `issues/` directory with 10 markdown issue files (FE-001 through FE-009). All synced to Linear (RON-5 through RON-14) with labels, priorities, and full descriptions
- **Simulated data disclaimer** — Added to CLAUDE.md and as banner in each client file (Bureau Veritas, Intertek, TÜV SÜD). Clarifies all seed data is fabricated, not from Scope AI
- **API security layer** — JWT authentication (8h tokens), role-based access control (5 roles), per-role client field filtering, playbook redaction for non-DS roles, audit logging to `api/logs/audit.log`
- **New API endpoints** — `POST /api/auth/login` (returns JWT), `GET /api/audit` (DS-only, review request log)
- **Security middleware** — `api/middleware/auth.js`, `rbac.js`, `audit.js`, `redact.js` + `api/config/roles.js` for role definitions
- **Knowledge base** — 4 files in `data/knowledge/`: `scope_product.md`, `inspection_types.md`, `regulatory_standards.md`, `report_anatomy.md` (Layer 1 industry knowledge)
- **Friday trial infrastructure** — `data/friday/tool_capture.md` (Layer 2 capture template), `trial_log.md`, `FRIDAY_CHEATSHEET.md` (A4 quick reference)
- **Template library** — `data/templates/_template_index.md` (index), `example_pressure_vessel_api510.md` (reference pattern)
- **Slash commands** — Organised into 5 categories: Setup (`Friday_Context`, `Tool_Setup`, `Data_Cleanup`), Templating (`Template_Spec`, `Report_Map`, `Template_QA`, `Pattern_Check`), Strategy (all deployment commands), System (`Pivot`, `System_Review`, `Explore`), Anytime (`Ask_Right`)
- **Dev workflow commands** — `explore`, `create-plan`, `execute`, `review`, `peer-review`, `document`, `create-issue`, `learning-opportunity`

- **Project docs** — `README.md`, `SECURITY.md` (plain-English overview), `SECURITY_PLAN.md`, `api/security/REFERENCE.md` (technical reference)
- `.gitignore` — excludes `data/friday/trial_log.md`, `api/logs/`, `data/outputs/`, `node_modules`, `.env`, `frontend/.env`
- `jsonwebtoken`, `pptxgenjs`, `pdfkit` dependencies added to API

### Changed

- **FE-017 / RON-22 — Request Edit modal redesign** — Modal now shows a single auto-generated TLDR textarea (editable, composed from flagged sections' confidence labels, reasons, and recommended fixes) plus one optional comment box. Replaces the previous per-section form with 4 fields each. API endpoint `POST /api/templates/:slug/request-edit` updated: accepts `{ templateName, body, comment? }` instead of `{ templateName, sections[] }`. Linear issue receives the TLDR body directly as the description
- **FE-016 / RON-21 — Section hover tooltip** — Non-green sections now show reason (from markdown `| reason` text) + auto-generated action on hover. Green sections and sections without reason text have no tooltip. Previously all sections showed a tooltip with a generic label
- **RON-19 — PatternGrid visual redesign** — Replaced table-with-dots layout with mosaic heatmap: 28px filled squares with 3px gaps, red/blue gradient color scale, cursor-following hover tooltip (replaces click popover). Radix Popover dependency removed. All existing features preserved (DS row selection with ring highlight, core block indicators, template filter, family grouping)
- **Templates page** — Now mounts PatternGrid + PatternDetection (accordion), core block extraction flow (dialog), and CoreBlockManager section. Fetches core blocks via `GET /api/templates/core-blocks` for grid annotation
- **`/dev:create-plan`** — Added sanity check gate before plan is saved: (1) AI slop removal — every step must be a concrete, verifiable action, (2) coverage check — cross-references plan against `/explore` discussion and any `/create-issue` output, (3) scope creep check — removes anything not discussed. Also added large plan splitting: groups steps by dependency, provides paste-ready `/dev:execute Group [X]` prompts per group
- **`/dev:create-issue`** — Now creates issues in both local `issues/` markdown file and Linear (via MCP tools) with title, description, priority mapping, and label sync. Falls back to local-only if Linear is unavailable
- **CLAUDE.md** — Added `/Template_Generate` to Category 2 command table. Updated trial day pipeline flow (`→ /Template_Generate →` between QA and Pattern_Check). Previously: added simulated data disclaimer, 5-category command structure, knowledge/template/security sections
- **API overview endpoint** — `templatesPerClient` stat now computed from live template cache (was missing). Onboarding time computed from date-created to first milestone. Inspection improvement excludes stalled/at-risk clients
- **API server** — Template parser loaded at startup, cached in memory, auto-reloads on file changes in `data/templates/`
- **Role config** — Added `templates`, `template_detail`, `template_patterns`, `template_generate`, `template_output` to endpoint access and route map for DS + FDE roles
- **Client detail endpoint** — Response is now field-filtered by the requesting user's role
- **Playbook endpoint** — Response is now redacted (anonymous client labels) for non-DS roles
- **Markdown parser** — Fixed `parseKeyValueBullets` regex to match colon inside bold markers (`**Key:**` not `**Key**:`)

### Fixed

- **FE-018 / RON-23 — "Send to Linear" error handling** — `handleSendToLinear` no longer swallows errors with a generic toast. Now surfaces specific messages: "API server not responding" on network failure, login status code on auth failure, and the API's `error` field from the response body on 4xx/5xx. Previously all failures showed "Failed to create edit request"
- **FE-002** — API URL now reads from `VITE_API_BASE` env var instead of hardcoded `localhost:3001`
- **FE-003** — Client data fully typed with `ClientApiResponse` interface across all 6 tab components, `ClientDetail`, and `ClientQuickView` (was `any` everywhere)
- **FE-004** — `useApiData` hook rewritten to use `@tanstack/react-query` with 30s stale/refetch interval (was manual `useEffect` + `setInterval`)
- **FE-006** — Status badge text no longer wraps to a second line in narrow table cells. Added `whitespace-nowrap` to all 11 badge CSS classes in `index.css` + inline badge in `ClientQuickView.tsx`
- **FE-007 (badge overflow)** — Coloured badges no longer bleed outside their card container. `PatternCard` (Playbook) now splits confidence strings at `(` — badge shows only the level word (`High` / `Medium` / `Low`), evidence text renders as a small muted line beneath. Stakeholder priority badge fixed to render the short key (`Primary` / `Secondary` / `Champion`) instead of the full field value (e.g. `"Primary — exec sponsor"`)

### Removed

- `LOVABLE_PROMPT.md` — Replaced by frontend-specific docs in `frontend/`
- **FE-007** — Terminal page removed entirely. Was a canned animation loop with no real functionality. Route, component, sidebar nav entry, and terminal-only CSS/Tailwind config (`--terminal-*` vars, `blink` animation, `terminal` color tokens) all cleaned up. FE-001 (terminal pause bug) now obsolete
