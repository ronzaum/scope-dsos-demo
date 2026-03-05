# 026: Code Review Action Plan — Security, Correctness & Quality

**Type:** Improvement | **Priority:** High | **Effort:** Medium
**Related:** Full project peer review (2026-03-05)

## TL;DR

Full project code review surfaced 12 confirmed issues across API security, React correctness, and code quality. Three are blocking (path traversal, render-time state updates, JWT fallback). The rest are medium/low improvements.

## Do Now (Blocking)

### 1. Path traversal via unvalidated `slug` in output route
- **File:** `api/server.js:607-632`
- **Current:** The `:slug` param in `/api/templates/:slug/output/:filename` is not validated. An authenticated user can pass `../../etc` as slug to read files outside the outputs directory.
- **Fix:** Validate slug against `cache.templates.templates` keys before constructing the file path. Reject unknown slugs with 404.

### 2. Render-time state updates in Templates
- **File:** `frontend/src/pages/Templates.tsx:289-295` (TemplateRow) and `:386-397` (TemplateDetail)
- **Current:** `setChecked(true)` and `apiFetch` called directly in the component body, not in a `useEffect`. Violates React rules, breaks in Strict Mode, risks bugs on future React upgrades.
- **Fix:** Move the `if (!checked)` pattern into a `useEffect` with proper dependency arrays.

### 3. JWT fallback secret allows token forgery
- **File:** `api/middleware/auth.js:13`
- **Current:** `const JWT_SECRET = process.env.DSOS_JWT_SECRET || 'dsos-demo-secret-change-in-production'` — if env var is unset, tokens can be forged with the known default.
- **Fix:** Throw an error if `DSOS_JWT_SECRET` is not set when `NODE_ENV === 'production'`, or remove the fallback entirely.

## Do Soon (Medium)

### 4. Uncaught sync JSON parse can crash process
- **File:** `api/server.js:658-659`
- **Current:** `JSON.parse(fs.readFileSync(...))` outside try-catch. Corrupt JSON crashes the server.
- **Fix:** Wrap in try-catch, return empty array on parse failure.

### 5. Remove dead cookie parsing code
- **File:** `frontend/src/pages/Templates.tsx:404`
- **Current:** Regex parses `document.cookie` for token, result is never used — immediately re-authenticates via fetch on the next line.
- **Fix:** Delete the dead line.

### 6. Move Linear IDs to environment variables
- **File:** `api/server.js:692-694`
- **Current:** `TEAM_ID`, `PROJECT_ID`, `ASSIGNEE_ID` hardcoded in source. Not secrets but reduces portability.
- **Fix:** Move to `.env` alongside `LINEAR_API_KEY`.

### 7. Open CORS allows all origins
- **File:** `api/server.js:171`
- **Current:** `app.use(cors())` with no options.
- **Fix:** Restrict to known origins via env var: `cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'] })`.

### 8. Audit log reads full file into memory
- **File:** `api/middleware/audit.js:71`
- **Current:** `readAuditLog` reads the entire log file regardless of the `limit` parameter. Will degrade as audit.log grows.
- **Fix:** Stream/tail the file or cap file size with rotation.

### 9. Replace `any` types with proper interfaces
- **Files:** `frontend/src/pages/Templates.tsx:59,60,88,129,284,370`, `frontend/src/pages/Knowledge.tsx:14`, `frontend/src/components/knowledge/KnowledgePanel.tsx:31`
- **Current:** `useApiData<any>` and `template: any` where typed interfaces exist.
- **Fix:** Use existing `TemplateSection` and `KnowledgeSection` interfaces or create new ones.

## Backlog (Low)

### 10. Structured logging for API
- **Files:** 50+ `console.log` calls across `api/server.js`
- **Fix:** Adopt `pino` or `winston` with log levels.

### 11. Add timeout on Linear API fetch calls
- **File:** `api/server.js:723,763,785`
- **Fix:** Use `AbortController` with a 10s timeout.

### 12. console.error in NotFound page
- **File:** `frontend/src/pages/NotFound.tsx:8`
- **Fix:** Remove or gate behind `import.meta.env.DEV`.

## Notes

- Findings from the initial automated review were peer-reviewed and filtered. 8 findings were rejected as false positives or overstated (see conversation for details).
- The `.env.production` file tracked in git contains only `VITE_API_BASE=` (empty) — confirmed non-sensitive.
- Sync file I/O (audit, template writes, generators) was downgraded from HIGH to MEDIUM given the single-user demo context.
