# DS-OS Security Documentation

Last updated: 2026-03-03

DS-OS keeps all data on your machine. Nothing leaves the network. Every API request requires a login token, and what you can see depends on your role — so client data is only visible to the people who need it. Every request is logged, client names are anonymised in shared views, and there's a one-command cleanup to wipe all session data when you're done.

---

## What's Implemented

| Feature | Status | Location |
|---------|--------|----------|
| JWT Authentication | Live | `api/middleware/auth.js` |
| Role-Based Access Control (RBAC) | Live | `api/middleware/rbac.js`, `api/config/roles.js` |
| Audit Logging | Live | `api/middleware/audit.js` → `api/logs/audit.log` |
| Playbook Redaction | Live | `api/middleware/redact.js` |
| Data Consent (trial day) | Live | `.claude/commands/setup/Friday_Context.md` (Step 0) |
| Data Cleanup command | Live | `.claude/commands/setup/Data_Cleanup.md` |
| Sensitive path exclusion | Live | `.gitignore` |

### Authentication
- Bearer token (JWT) required on all API endpoints except `/api/health` and `/api/auth/login`.
- Tokens signed with `DSOS_JWT_SECRET` env var (demo fallback provided).
- 8-hour expiry — one login covers a full working day.
- Login requires name + role. No password — this is a demo system with role-based trust.

### Role-Based Access Control
- 5 roles enforced at the API layer: `ds`, `fde`, `ae`, `leadership`, `view_only`.
- Each role has an explicit endpoint access list (see Role Permissions Matrix below).
- Client detail responses are field-filtered per role — FDE sees technical fields, AE sees commercial fields, DS sees everything.

### Audit Logging
- Every API request logged: timestamp, user, role, method, path, HTTP status, response time.
- Written to `api/logs/audit.log` as JSON lines (one entry per line).
- Audit log is gitignored — never committed to version control.
- Accessible via `GET /api/audit` (DS-only).

### Playbook Redaction
- Cross-client patterns in the playbook remain useful, but client names are replaced with anonymous labels (Client A, Client B, ...) for non-DS roles.
- Redaction map built dynamically from `/data/clients/` filenames.
- Deep string replacement — catches names in any nested JSON field.

### Data Consent
- `/Friday_Context` now includes a Step 0 that briefs the user on what data will be stored before any capture begins.
- Requires verbal confirmation before proceeding.
- Consent status logged in the trial log entry.

### Data Cleanup
- `/Data_Cleanup` command lists all session data, requires explicit confirmation, logs the cleanup action to system log, then purges.
- Never touches knowledge base, templates, playbook, or system config.

---

## Data Residency

**Everything runs locally.** No cloud services, no external API calls, no telemetry.

- The DS-OS API server runs on `localhost:3001`.
- All data lives in local markdown files under `/data/`.
- The frontend connects to the local API only.
- Claude Code (the AI assistant) runs locally via Anthropic's CLI.
- No data is transmitted to external servers beyond the Claude API calls required for the AI assistant to function.

---

## Data Map

### Sensitive (gitignored, never committed)

| Path | Contents | Risk |
|------|----------|------|
| `/data/clients/*.md` | Client names, contacts, contract values, deployment details | High — PII + commercial |
| `/data/friday/trial_log.md` | Trial day observations, meeting attendees, context | High — PII |
| `api/logs/audit.log` | API request log with user names and access patterns | Medium — usage data |

### Non-sensitive (tracked in git)

| Path | Contents | Risk |
|------|----------|------|
| `/data/knowledge/` | Industry knowledge, product info, standards | None — reference material |
| `/data/templates/` | Inspection template specs | None — structural definitions |
| `/data/playbook/` | Deployment patterns, resolution patterns | Low — anonymisable |
| `/data/system/` | System log, method registry, architecture | None — operational metadata |

---

## Trial Day Data Policy

The lifecycle for trial day data:

1. **Consent** — `/Friday_Context` Step 0 briefs the user and asks for confirmation before any data capture.
2. **Capture** — Session data written to `/data/friday/trial_log.md` and `/data/clients/` as needed.
3. **Use** — Data informs template specs, deployment plans, and issue resolution during the session.
4. **Cleanup** — `/Data_Cleanup` purges all session data at end of day. System log records what was deleted.

If consent is declined, DS-OS operates in read-only mode (knowledge base access only, no data capture).

---

## Role Permissions Matrix

| Endpoint | DS | FDE | AE | Leadership | View Only |
|----------|:--:|:---:|:--:|:----------:|:---------:|
| `GET /api/health` | yes | yes | yes | yes | yes |
| `GET /api/overview` | yes | yes | yes | yes | yes |
| `GET /api/clients` | yes | yes | yes | yes | no |
| `GET /api/clients/:slug` | all fields | technical fields | commercial fields | overview fields | no |
| `GET /api/playbook` | raw | redacted | no | redacted | no |
| `GET /api/methods` | yes | yes | no | no | no |
| `GET /api/system/log` | yes | yes | no | no | no |
| `GET /api/audit` | yes | no | no | no | no |

### Client Field Visibility by Role

- **DS (Deployment Strategist):** All fields
- **FDE (Forward Deployed Engineer):** name, slug, profile, deploymentState, constraintMap, issueLog, interactionHistory
- **AE (Account Executive):** name, slug, profile, commercial, deploymentState, interactionHistory, stakeholderMap
- **Leadership:** name, slug, profile, commercial, deploymentState, playbookContributions
- **View Only:** No client detail access (blocked at endpoint level)

---

## Audit Trail

### What's Logged

Every HTTP request to the API is logged with:
- Timestamp (ISO 8601)
- User name (from JWT, or "anonymous" for unauthenticated requests)
- User role (from JWT, or "none")
- HTTP method and path
- Response status code
- Response time in milliseconds

### Where

`api/logs/audit.log` — JSON lines format. One JSON object per line.

### How to Review

```bash
# View recent entries (last 20 lines)
tail -20 api/logs/audit.log | jq .

# Via the API (DS role required)
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/audit

# Filter for specific user
cat api/logs/audit.log | jq 'select(.user == "Ron")'

# Filter for errors
cat api/logs/audit.log | jq 'select(.status >= 400)'
```

---

## Running on Client Machine

If the client requires DS-OS to run on their own hardware (no data leaves their network):

### Prerequisites
- Node.js 18+ installed
- Git installed

### Setup

```bash
# 1. Clone the repository
git clone <repo-url> ds-os
cd ds-os

# 2. Install API dependencies
cd api && npm install && cd ..

# 3. Set a real JWT secret (optional but recommended)
export DSOS_JWT_SECRET="$(openssl rand -hex 32)"

# 4. Start the API server
cd api && npm start

# 5. Open the frontend
# Open frontend/index.html in a browser, or serve it:
# npx serve frontend
```

### What Runs Where
- **API server:** `localhost:3001` — serves data from local markdown files
- **Frontend:** Static HTML/JS — connects to the local API
- **Claude Code:** Runs via Anthropic CLI on the same machine — slash commands read/write local files

### Network Requirements
- **Outbound:** Claude API calls only (for the AI assistant). All other operations are local.
- **Inbound:** None. The server only listens on localhost.

---

## Future Security Roadmap

These items are documented but not yet implemented:

| Feature | Complexity | Blocked By |
|---------|-----------|------------|
| Encryption at rest | High | Requires rearchitecting the markdown-as-database model. Every file read/write would need encrypt/decrypt. |
| File-level RBAC | High | Can't be enforced when Claude reads files directly via the filesystem. Would need a file access proxy layer. |
| Database migration | High | Moving from markdown to a proper database (SQLite/Postgres) would enable encryption, RBAC, and ACID transactions. Major architectural change. |
| GDPR compliance | Medium | Requires: data subject access requests, right to deletion, processing records, consent management. Partially addressed by cleanup command. |
| Password authentication | Low | Current login uses name + role (trust-based for demo). Production would need passwords or SSO. |
| Token refresh | Low | Currently 8h expiry with no refresh. Production would use refresh tokens. |
| Rate limiting | Low | No rate limiting currently. Production would add per-user request limits. |
| HTTPS | Low | Currently HTTP on localhost. Production would need TLS termination. |
