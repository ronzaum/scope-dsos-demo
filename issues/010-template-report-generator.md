# BE-010: Template Report Generator (PPTX + PDF)

**Type:** Feature | **Priority:** High | **Effort:** Large

## TL;DR
Build an automated report generator that takes a validated template spec (markdown) and produces a realistic, editable PPTX and a previewable PDF. Outputs visible in DS-OS frontend (PDF preview, download for both formats). Theme is swappable — default professional layout now, Scope's actual format applied on Friday. Includes a verification pass on the knowledge base before building.

## Current State
- Template specs exist as markdown files in `/data/templates/` (e.g., pressure vessel API 510)
- Specs define fields, sections, classification systems, validation rules — all format-agnostic
- No mechanism to go from spec → actual report file (PPTX or PDF)
- Knowledge base (Layer 1) is AI-generated, not verified against regulatory sources
- No confidence tagging on spec sections
- PowerPoint confirmed as output format by Jonathan but not recorded anywhere in DS-OS

## Expected Outcome
- `POST /api/templates/:slug/generate` produces .pptx + .pdf, stores in `/data/outputs/[slug]/`
- `GET /api/templates/:slug/output` serves generated files
- Frontend template detail page shows: PDF preview (embedded), download buttons (PPTX + PDF), generate button
- `/Template_Generate` slash command triggers generation from CLI
- Pipeline: `/Template_Spec` → `/Template_QA` → `/Template_Generate` → `/Pattern_Check`
- Knowledge base verified against LOLER Schedule 1, BS 7671 EICR, API 510 report requirements
- Template spec sections tagged with confidence levels: Regulatory / Industry Standard / Inferred
- Mock data is realistic, passes spec validation rules, clearly marked as simulated (first slide banner + footer watermark)
- Theme config is swappable JSON — colors, fonts, logo, layout, finding display mode

## Files

**New files:**
- `api/generators/pptx.js` — PPTX generation engine (pptxgenjs)
- `api/generators/pdf.js` — PDF generation
- `api/generators/themes/default.json` — swappable theme config
- `api/generators/sample-data/pressure_vessel_sample.json` — realistic mock inspection data
- `.claude/commands/templating/Template_Generate.md` — slash command
- `/data/outputs/` — generated file storage (gitignored)
- `/data/reference-reports/` — staging area for visual references (gitignored)

**Modified files:**
- `api/server.js` — new generate + output endpoints, file watcher for outputs
- `data/knowledge/regulatory_standards.md` — corrections from verification pass
- `data/knowledge/inspection_types.md` — corrections from verification pass
- `data/knowledge/report_anatomy.md` — corrections from verification pass
- `data/knowledge/scope_product.md` — add confirmed PowerPoint output format
- `data/templates/example_pressure_vessel_api510.md` — add confidence tags per section
- `data/friday/tool_capture.md` — pre-fill output format as PowerPoint (confirmed)
- `data/friday/FRIDAY_CHEATSHEET.md` — note report generation capability
- `data/templates/_template_index.md` — reflect output capability
- `CLAUDE.md` — add `/Template_Generate` to command table + pipeline flow
- Frontend: template detail page (generate button, PDF preview, downloads, status)
- Frontend: template list view (show which templates have generated outputs)

## Execution Groups
- **Group A (Steps 1–3):** Verify knowledge base, add confidence tags, scaffold folders
- **Group B (Steps 4–7):** Build mock data, theme config, PPTX generator, PDF generator
- **Group C (Steps 8–12):** API endpoints, slash command, frontend integration, docs, e2e verify

## Notes
- Full plan with subtasks in `PLAN.md`
- Friday adaptation path: swap theme config + drop Scope's examples into reference folder + adjust field mapping. No rebuild.
- Finding layout is configurable via theme: `one-per-slide` (default) vs `summary-table`
- BSEE offshore investigation reports (from team research) used as structural sanity check during verification
- Confidence indicators render in generated output — `Inferred` sections carry subtle mark
- PPTX must be editable in PowerPoint/Google Slides/Keynote after generation
