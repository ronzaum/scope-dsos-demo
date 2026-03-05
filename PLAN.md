# Code Review Action Plan — Security, Correctness & Quality

**Overall Progress:** `100%`
**Issue:** `issues/026-code-review-action-plan.md` | **Linear:** RON-35

## TLDR

Full project peer review confirmed 12 issues. Fix the 3 blocking items (path traversal, render-time state updates, JWT hardening), then 6 medium items (crash guard, dead code, env vars, CORS, audit memory, type safety), then 3 low backlog items. 8 initial findings were rejected as false positives.

## Critical Decisions

- **Path traversal fix uses cache validation** — validate slug against `cache.templates.templates` map rather than regex sanitization, because the cache is the authoritative list of valid slugs
- **JWT fallback kept for dev only** — guard on `NODE_ENV === 'production'` rather than removing the fallback entirely, so local dev still works without .env
- **Render-time state fix uses useEffect + ref** — convert the `if (!checked)` pattern to `useEffect` with a ref to prevent double-fire in Strict Mode
- **Sync I/O left as-is** — downgraded to backlog given single-user demo context; not included in this plan

## Tasks

### Group A: Blocking Fixes (Security + Correctness)

- [x] 🟩 **Step 1: Fix path traversal in template output route**
  - [x] 🟩 In `api/server.js:607`, before constructing `filePath`, validate that `slug` exists in `cache.templates.templates` (same check as line 494). Return 404 if not found
  - [x] 🟩 Apply the same slug validation to `GET /api/templates/:slug/output` (line 583) for consistency

- [x] 🟩 **Step 2: Fix render-time state updates in TemplateRow**
  - [x] 🟩 In `frontend/src/pages/Templates.tsx:289-295`, replace the `if (!checked)` block with a `useEffect` that runs on mount, using `slug` as dependency
  - [x] 🟩 Add `useEffect` import if not already present (it is not — only `useState, useCallback` are imported for TemplateRow)

- [x] 🟩 **Step 3: Fix render-time state updates in TemplateDetail**
  - [x] 🟩 In `frontend/src/pages/Templates.tsx:386-397`, replace the `if (!outputChecked)` block with a `useEffect` that runs on mount, using `slug` as dependency
  - [x] 🟩 Move the `loadPdfPreview` call inside the same effect (it's already a `useCallback`, so can be called from the effect)

- [x] 🟩 **Step 4: Harden JWT secret for production**
  - [x] 🟩 In `api/middleware/auth.js:13`, change to: `const JWT_SECRET = process.env.DSOS_JWT_SECRET || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('DSOS_JWT_SECRET must be set in production'); })() : 'dsos-demo-secret-change-in-production');`
  - [x] 🟩 `NODE_ENV=production` already present in `render.yaml`

### Group B: Medium Fixes (Robustness + Cleanup)

- [x] 🟩 **Step 5: Wrap uncaught JSON.parse in try-catch**
  - [x] 🟩 In `api/server.js:658-659`, wrap the `JSON.parse(fs.readFileSync(requestsFile, 'utf-8'))` in try-catch, defaulting to `[]` on parse failure

- [x] 🟩 **Step 6: Remove dead cookie parsing code**
  - [x] 🟩 Delete line 404 in `frontend/src/pages/Templates.tsx` (`const token = (document.cookie.match(...))`)

- [x] 🟩 **Step 7: Move Linear IDs to environment variables**
  - [x] 🟩 In `api/server.js:692-694`, replace hardcoded `TEAM_ID`, `PROJECT_ID`, `ASSIGNEE_ID` with `process.env.LINEAR_TEAM_ID`, `process.env.LINEAR_PROJECT_ID`, `process.env.LINEAR_ASSIGNEE_ID`
  - [x] 🟩 Add the three variables to `api/.env` with current values
  - [x] 🟩 Add the three variables to `render.yaml` environment section

- [x] 🟩 **Step 8: Restrict CORS to known origins**
  - [x] 🟩 In `api/server.js:171`, replace `app.use(cors())` with `app.use(cors({ origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true }))`
  - [x] 🟩 Add `ALLOWED_ORIGINS` to `render.yaml` environment section

- [x] 🟩 **Step 9: Cap audit log memory usage**
  - [x] 🟩 In `api/middleware/audit.js:71`, replace `fs.readFileSync` with a tail-based approach: read last 512KB of file rather than the entire file

- [x] 🟩 **Step 10: Replace `any` types with proper interfaces**
  - [x] 🟩 In `frontend/src/pages/Templates.tsx:59`, replace `useApiData<any>` with `TemplatesResponse` interface
  - [x] 🟩 In `frontend/src/pages/Templates.tsx:284`, replace `template: any` with `TemplateListItem` in TemplateRow props
  - [x] 🟩 In `frontend/src/pages/Templates.tsx:370`, replace `useApiData<any>` with `TemplateFullDetail`
  - [x] 🟩 In `frontend/src/pages/Knowledge.tsx:14` and `frontend/src/components/knowledge/KnowledgePanel.tsx:31`, replace `data: any` with `Record<string, unknown>`

### Group C: Backlog (Low Priority)

- [x] 🟩 **Step 11: Add timeout on Linear API fetch calls**
  - [x] 🟩 In `api/server.js`, add `signal: AbortSignal.timeout(10000)` to all 3 Linear `fetch()` calls

- [x] 🟩 **Step 12: Remove console.error in NotFound**
  - [x] 🟩 In `frontend/src/pages/NotFound.tsx:7-9`, delete the `useEffect` block, `useEffect` import, and `useLocation` (all unused)

## Execution Groups

**Group A: Blocking Fixes** (Steps 1-4)
Security and correctness — must ship first. Path traversal is exploitable, React bugs affect stability, JWT fallback is a production risk. All 4 steps are independent of each other.

**Group B: Medium Fixes** (Steps 5-10)
Robustness and cleanup. Each step is independent. Can run after Group A or in parallel.

**Group C: Backlog** (Steps 11-12)
Nice-to-have. Can be done anytime.

## Paste-Ready Prompts

```
/dev:execute Group A — Blocking Fixes: Fix path traversal in template output route (validate slug against cache), convert render-time state updates to useEffect in TemplateRow and TemplateDetail, harden JWT secret for production. Steps 1-4 in PLAN.md. Addresses issues/026-code-review-action-plan.md.
```

```
/dev:execute Group B — Medium Fixes: Wrap uncaught JSON.parse in try-catch, remove dead cookie code, move Linear IDs to env vars, restrict CORS origins, cap audit log memory, replace any types with interfaces. Steps 5-10 in PLAN.md. Addresses issues/026-code-review-action-plan.md.
```

```
/dev:execute Group C — Backlog: Add 10s timeout on Linear API fetch calls, remove console.error in NotFound page. Steps 11-12 in PLAN.md. Addresses issues/026-code-review-action-plan.md.
```
