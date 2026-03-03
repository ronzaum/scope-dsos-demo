# Frontend Architecture

## How it connects

```
Claude Code (slash commands)
    ↓ writes markdown files
/data/ (markdown files = the database)
    ↓ read by
api/server.js (Express + chokidar file watcher + in-memory cache)
    ↓ serves JSON via HTTP
Frontend (Lovable-built, polls API every 5s)
```

The pipeline is: command runs → markdown file updated → file watcher detects change → cache refreshes → next frontend poll picks it up. Latency: ~5 seconds from command execution to dashboard update.

---

## What already exists

### API server (`api/server.js`)
- Express server on `localhost:3001`
- Reads all markdown files from `/data/` on startup
- Parses client files, playbook, system files into structured JSON
- Caches parsed data in memory (Map for clients, objects for playbook/system)
- Watches `/data/**/*.md` with chokidar — selective reload on change
- Endpoints: `/api/overview`, `/api/clients`, `/api/clients/:slug`, `/api/playbook`, `/api/methods`, `/api/system/log`

### Lovable demo (`frontend/lovable_prompts/LOVABLE_PROMPT.md`)
- Full design spec for a 4-page dashboard (Overview, Clients, Terminal, Playbook)
- Design system defined (dark theme, Inter + JetBrains Mono, data-dense)
- Currently disconnected — static frontend with fallback data, not wired to the API
- See [lovable_status.md](lovable_status.md) for current state

---

## What needs building

### Connect Lovable frontend to live API
The frontend spec already defines the polling pattern and endpoint structure. The API already serves the right shape. Gap is wiring them together and ensuring the Lovable build actually fetches from `localhost:3001`.

### Natural language query endpoint
New endpoint: `POST /api/query` or similar.
- Takes a text question
- Maps it to the right data lookup (client search, template filter, pattern match)
- Returns structured results
- Could be as simple as keyword matching against cached data, or use an LLM for interpretation

### Template and report browsing
New endpoints:
- `GET /api/templates` — list all templates with status and metadata
- `GET /api/templates/:slug` — full template content
- These don't exist yet in `api/server.js` — the parsers would need to cover `/data/templates/`

### Cross-client pattern aggregation
New endpoint: `GET /api/patterns` or extend `/api/overview`
- Aggregate health signals across all clients
- Surface playbook entries with client attribution
- Compute deployment stats by status category
