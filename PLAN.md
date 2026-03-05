# FE-015: Deploy DS-OS as a Shareable URL

**Overall Progress:** `100% (Group A)`

Addresses `issues/015-deploy-shareable-url.md` | Linear: RON-20

## TLDR

Deploy DS-OS to a public URL on Render (free tier) so Scope can interact with it directly. Single Express process serves both the API and the built frontend. Password gate (`complianceismypassion`) on entry. Public GitHub repo so they can browse the source. UptimeRobot pings `/api/health` every 14 minutes to prevent cold starts.

## Critical Decisions

- **Single service** — Express serves `frontend/dist/` static files alongside `/api/*` routes. One process, one port, no CORS needed. Simplest possible deployment.
- **Public repo** — all data is simulated with disclaimer banners, secrets are gitignored. Scope seeing the code is a feature, not a risk.
- **Client-side password gate** — not a security boundary, just access control. `sessionStorage` so it persists per tab. Wraps the entire app before `AuthProvider` mounts.
- **UptimeRobot keep-alive** — free service pings health endpoint every 14min, Render never sleeps. 750 free hours/month = 31 days, cannot be exceeded by a single service.

## Execution Groups

**Group A: Code Changes** — Make the codebase deploy-ready. Express static serving, password gate, gitignore update, env config, render.yaml. Steps 1-5.

**Group B: Deploy** — Push to GitHub, connect Render, set up UptimeRobot. Steps 6-7. These are manual platform tasks, not code — listed here for completeness but executed outside `/dev:execute`.

Dependencies: B requires A to be complete (code must be ready before pushing/deploying).

## Tasks

### Group A: Code Changes

- [x] 🟩 **Step 1: Express serves frontend static files**
  - [x] 🟩 In `api/server.js`, after the last `/api/*` route and before `app.listen()`, add `express.static()` middleware pointing at `path.resolve(__dirname, '..', 'frontend', 'dist')`
  - [x] 🟩 Add catch-all `app.get('*')` route below the static middleware that sends `frontend/dist/index.html` — this handles React Router client-side routing (e.g. `/clients/bureau_veritas` loads the SPA, not a 404)

- [x] 🟩 **Step 2: Production env for frontend**
  - [x] 🟩 Create `frontend/.env.production` with `VITE_API_BASE=` (empty string — same-origin requests when served from Express)

- [x] 🟩 **Step 3: Password gate component**
  - [x] 🟩 Create `frontend/src/components/AccessGate.tsx` — full-screen centered card with a single text input ("Enter access code") and a submit button
  - [x] 🟩 On submit, compare input to the string `complianceismypassion`. If match, write `dsos-access=true` to `sessionStorage` and render children. If wrong, show inline error text
  - [x] 🟩 On mount, check `sessionStorage` for `dsos-access=true` — if present, skip the gate and render children immediately
  - [x] 🟩 In `frontend/src/App.tsx`, wrap the entire existing JSX tree with `<AccessGate>...</AccessGate>` so it sits outside `AuthProvider` — no API calls fire until the code is entered

- [x] 🟩 **Step 4: Un-gitignore client data**
  - [x] 🟩 Remove the `/data/clients/` line from `.gitignore`
  - [x] 🟩 Verify all 3 client files (`bureau_veritas.md`, `intertek.md`, `tuv_sud.md`) have the `> **SIMULATED DATA**` disclaimer banner at the top

- [x] 🟩 **Step 5: Render deployment config**
  - [x] 🟩 Create `render.yaml` in project root with: service type `web`, build command `cd frontend && npm install && npm run build && cd ../api && npm install`, start command `cd api && node server.js`, env vars `NODE_ENV=production` and `DSOS_JWT_SECRET` (marked as `generateValue: true` so Render auto-generates it)

### Group B: Deploy (manual platform tasks)

- [ ] 🟥 **Step 6: Push to GitHub**
  - [ ] 🟥 Create public repo on GitHub
  - [ ] 🟥 Add remote, push all code including client data

- [ ] 🟥 **Step 7: Render + UptimeRobot**
  - [ ] 🟥 Connect Render to the GitHub repo, deploy via the `render.yaml` blueprint
  - [ ] 🟥 Set `LINEAR_API_KEY` env var on Render if Linear integration is wanted
  - [ ] 🟥 Sign up for UptimeRobot (free), add HTTP monitor: `GET https://[app].onrender.com/api/health`, interval 14 minutes
