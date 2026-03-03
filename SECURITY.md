# DS-OS — Security

DS-OS handles sensitive client data during deployments. We built a security layer into the API to make sure that data is protected, access is controlled, and nothing persists longer than it needs to. Everything runs locally — no data leaves the machine.

---

## What's in place

- **JWT Authentication** — You log in with your name and role. The system gives you a token that lasts 8 hours. Every request after that needs that token or it gets rejected.
- **Role-Based Access Control** — Five roles (DS, FDE, AE, Leadership, View Only). Each role only sees the data relevant to them. An AE sees commercial info but not technical internals. An FDE sees issues and diagnostics but not contracts.
- **Client Field Filtering** — When you pull up a client, the response is stripped down to only the fields your role is allowed to see. The DS sees everything. Everyone else gets a filtered view.
- **Playbook Redaction** — The playbook contains cross-client patterns. For non-DS roles, all client names are swapped with anonymous labels (Client A, Client B). The insights stay useful, the identities stay hidden.
- **Audit Logging** — Every API request is logged: who made it, what they accessed, when, and the response time. The DS can review the full audit trail at any time.
- **Data Consent** — Before any trial day data capture begins, the system explains what will be stored and asks for explicit consent. If declined, no data is captured.
- **Data Cleanup** — One command (`/Data_Cleanup`) lists all session data, asks for confirmation, and wipes it. Nothing lingers after a session unless you want it to.
- **Sensitive Path Exclusion** — Client files, trial logs, and audit logs are gitignored. They never get committed to version control.
- **Local-Only Architecture** — No cloud database, no external API calls, no telemetry. The server runs on localhost. The only outbound connection is to the Claude API for the AI assistant.

---

## Running on client hardware

If a client doesn't want DS-OS running on your machine, it can run entirely on theirs. Nothing needs to leave their network.

1. Download the system from Git onto their machine
2. Run `npm install` in the `api/` folder
3. Start the server with `npm start`
4. Open the frontend in a browser

That's it. The whole system runs on localhost. The only thing that needs internet is the Claude API connection for the AI assistant — everything else is local.

Full setup instructions are in the technical reference.

---

## What's planned

- **Encryption at rest** — Encrypt data files on disk so they're not readable outside the system.
- **Password authentication** — Replace the current trust-based role login with proper credentials or SSO.
- **HTTPS** — Add TLS for network deployments (localhost doesn't need it, but anything beyond that does).
- **GDPR compliance tooling** — Data subject access requests, right to deletion, processing records.
- **Database migration** — Move from markdown files to a proper database for encryption, transactions, and file-level access control.

---

Technical reference: `[api/security/REFERENCE.md](api/security/REFERENCE.md)`