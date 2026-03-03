# Changelog

## Unreleased

### Added

- **API security layer** — JWT authentication (8h tokens), role-based access control (5 roles), per-role client field filtering, playbook redaction for non-DS roles, audit logging to `api/logs/audit.log`
- **New API endpoints** — `POST /api/auth/login` (returns JWT), `GET /api/audit` (DS-only, review request log)
- **Security middleware** — `api/middleware/auth.js`, `rbac.js`, `audit.js`, `redact.js` + `api/config/roles.js` for role definitions
- **Knowledge base** — 4 files in `data/knowledge/`: `scope_product.md`, `inspection_types.md`, `regulatory_standards.md`, `report_anatomy.md` (Layer 1 industry knowledge)
- **Friday trial infrastructure** — `data/friday/tool_capture.md` (Layer 2 capture template), `trial_log.md`, `FRIDAY_CHEATSHEET.md` (A4 quick reference)
- **Template library** — `data/templates/_template_index.md` (index), `example_pressure_vessel_api510.md` (reference pattern)
- **Slash commands** — Organised into 5 categories: Setup (`Friday_Context`, `Tool_Setup`, `Data_Cleanup`), Templating (`Template_Spec`, `Report_Map`, `Template_QA`, `Pattern_Check`), Strategy (all deployment commands), System (`Pivot`, `System_Review`, `Explore`), Anytime (`Ask_Right`)
- **Dev workflow commands** — `explore`, `create-plan`, `execute`, `review`, `peer-review`, `document`, `create-issue`, `learning-opportunity`
- **Project docs** — `README.md`, `SECURITY.md` (plain-English overview), `SECURITY_PLAN.md`, `api/security/REFERENCE.md` (technical reference)
- `.gitignore` — excludes `data/clients/`, `data/friday/trial_log.md`, `api/logs/`, `node_modules`
- `jsonwebtoken` dependency added to API

### Changed

- **CLAUDE.md** — Expanded from 2-half to 5-category command structure. Added knowledge base rules, template library rules, security section, new data directories (`knowledge/`, `friday/`, `templates/`), trial day and anytime pipeline flows
- **PLAN.md** — Replaced original build plan with completed extension implementation checklist (100% done)
- **API overview endpoint** — Onboarding time now computed from date-created to first milestone (was using raw `monthsIn`). Inspection improvement now excludes stalled/at-risk clients
- **Client detail endpoint** — Response is now field-filtered by the requesting user's role
- **Playbook endpoint** — Response is now redacted (anonymous client labels) for non-DS roles
- **Markdown parser** — Fixed `parseKeyValueBullets` regex to match colon inside bold markers (`**Key:**` not `**Key**:`)

### Removed

- `LOVABLE_PROMPT.md` — Replaced by frontend-specific docs in `frontend/`
