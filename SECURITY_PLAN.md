# DS-OS Security Layer — Implementation Plan

**Overall Progress:** `100%`

## TLDR

Add a full security layer to the DS-OS API so Scope sees a system that takes their client data seriously. JWT auth, role-based access control, audit logging, cross-client name redaction in the playbook, a data cleanup command, and a consent step before any data capture. Everything lives in the `api/` folder — zero impact on the slash command workflow. A `SECURITY.md` documents what's implemented, what's stored, and what's planned. Includes a quick-deploy guide for running DS-OS on Scope's machine if they won't let it run on yours.

## Critical Decisions

- **Security lives entirely in `api/`:** Slash commands read/write files directly and are untouched. The security layer protects the API + frontend surface. Your Friday workflow stays exactly the same.
- **JWT auth, not API keys:** More impressive, standard pattern, one login gives you a token for the day (8h expiry).
- **Role enforcement at the API level:** The five roles from CLAUDE.md become real middleware, not just documentation. Client detail responses are filtered per role.
- **Playbook redaction, not deletion:** Cross-client patterns stay useful but client names are replaced with anonymous labels (Client A, Client B) for non-DS roles.
- **Encryption at rest and file-level RBAC are future items:** Documented in SECURITY.md, not implemented. Encryption would require rearchitecting the markdown-as-database model. File-level RBAC can't be enforced when Claude reads files directly.
- **On-their-machine deployment:** A short guide in SECURITY.md covers running DS-OS on Scope's own machine — clone, install, run. No data leaves their network.

## Tasks

- [x] 🟩 **Step 1: .gitignore — exclude sensitive paths**
  - [x] 🟩 Add `/data/clients/` — client files never committed
  - [x] 🟩 Add `/data/friday/trial_log.md` — trial day observations never committed
  - [x] 🟩 Add `api/logs/` — audit logs never committed
  - [x] 🟩 Keep `/data/knowledge/` and `/data/templates/` tracked (non-sensitive)

- [x] 🟩 **Step 2: Role config — `api/config/roles.js`**
  - [x] 🟩 Define the 5 roles with endpoint access lists
  - [x] 🟩 Map route paths to endpoint keys
  - [x] 🟩 Define per-role client field visibility (DS sees all, FDE sees technical, AE sees commercial, etc.)

- [x] 🟩 **Step 3: Auth middleware — `api/middleware/auth.js`**
  - [x] 🟩 JWT verification on all routes except `/api/health` and `/api/auth/login`
  - [x] 🟩 Token generation function (name + role → signed JWT, 8h expiry)
  - [x] 🟩 Secret from `DSOS_JWT_SECRET` env var with demo fallback

- [x] 🟩 **Step 4: RBAC middleware — `api/middleware/rbac.js`**
  - [x] 🟩 Check `req.user.role` against endpoint permissions from role config
  - [x] 🟩 403 response with clear message on access denied
  - [x] 🟩 `filterClientFields()` utility — strips fields the role shouldn't see from client detail responses

- [x] 🟩 **Step 5: Audit middleware — `api/middleware/audit.js`**
  - [x] 🟩 Log every request: timestamp, user, role, method, path, status, response time
  - [x] 🟩 Write to `api/logs/audit.log` (JSON lines format, gitignored)
  - [x] 🟩 `readAuditLog()` utility for the audit endpoint

- [x] 🟩 **Step 6: Playbook redaction — `api/middleware/redact.js`**
  - [x] 🟩 Build redaction map from client file names → anonymous labels (Client A, B, C...)
  - [x] 🟩 `redact()` function — deep string replacement on any JSON object
  - [x] 🟩 Applied to playbook endpoint responses for non-DS roles

- [x] 🟩 **Step 7: Wire into server.js**
  - [x] 🟩 Add `POST /api/auth/login` endpoint (validates name + role → returns JWT)
  - [x] 🟩 Add `GET /api/audit` endpoint (DS-only, returns recent audit log)
  - [x] 🟩 Mount middleware stack: audit → auth → rbac (in that order)
  - [x] 🟩 Apply `filterClientFields()` in `/api/clients/:slug` route
  - [x] 🟩 Apply `redact()` in `/api/playbook` route for non-DS roles
  - [x] 🟩 Add `jsonwebtoken` to `api/package.json` dependencies
  - [x] 🟩 Update startup console output to list auth status and new endpoints

- [x] 🟩 **Step 8: Consent step in `/Friday_Context`**
  - [x] 🟩 Add a Step 0 before situation capture: brief the user on what data will be stored, where, and how to purge it
  - [x] 🟩 Ask for verbal confirmation before proceeding
  - [x] 🟩 Log consent acknowledgement in trial_log.md entry

- [x] 🟩 **Step 9: Data Cleanup command — `.claude/commands/setup/Data_Cleanup.md`**
  - [x] 🟩 New slash command: `/Data_Cleanup`
  - [x] 🟩 Lists what will be deleted (trial log entries, client files created this session, audit logs)
  - [x] 🟩 Requires explicit confirmation before purging
  - [x] 🟩 Writes a cleanup record to system log before deleting

- [x] 🟩 **Step 10: SECURITY.md**
  - [x] 🟩 Create `api/SECURITY.md`
  - [x] 🟩 Section: What's Implemented (auth, RBAC, audit, redaction, cleanup, consent, .gitignore)
  - [x] 🟩 Section: Data Residency (everything local, no cloud, no external calls)
  - [x] 🟩 Section: Data Map (sensitive vs non-sensitive paths, what's gitignored)
  - [x] 🟩 Section: Trial Day Data Policy (consent → capture → cleanup cycle)
  - [x] 🟩 Section: Role Permissions Matrix (the 5 roles, what each sees)
  - [x] 🟩 Section: Audit Trail (what's logged, where, how to review)
  - [x] 🟩 Section: Running on Client Machine (clone → install → run guide for Scope's own hardware)
  - [x] 🟩 Section: Future Security Roadmap (encryption at rest, file-level RBAC, database migration, GDPR compliance)

- [x] 🟩 **Step 11: Update CLAUDE.md**
  - [x] 🟩 Add Security section referencing `api/SECURITY.md`
  - [x] 🟩 Add Data Cleanup to the Setup command table
  - [x] 🟩 Note that API endpoints are now authenticated

- [x] 🟩 **Step 12: Test**
  - [x] 🟩 `npm install` in `api/` to pull jsonwebtoken
  - [x] 🟩 Start server, verify it boots without errors
  - [x] 🟩 Test login endpoint returns JWT
  - [x] 🟩 Test protected endpoint rejects unauthenticated requests
  - [x] 🟩 Test role-based filtering (DS sees all, view_only gets 403 on clients)
  - [x] 🟩 Test playbook redaction strips client names for non-DS roles
  - [x] 🟩 Verify audit log writes entries
  - [x] 🟩 Verify slash commands still work normally (unaffected)
