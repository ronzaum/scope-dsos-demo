# FE-015: Deploy DS-OS as a Shareable URL

**Type:** Feature | **Priority:** Urgent | **Effort:** Medium

## TL;DR
Deploy DS-OS as a single-service app on Render (free tier) so anyone at Scope can open a link and interact with the full system. Express API serves the frontend static files — one process, one port, one URL. Public GitHub repo so Scope can also browse the source. Password gate (`complianceismypassion`) to control access.

## Current State
- Frontend and API run locally only (two separate processes on ports 8080 and 3001)
- No deployment pipeline, no hosting, no remote configured
- Simulated client data is gitignored — wouldn't exist on a deployed server
- Frontend hardcodes `VITE_API_BASE=http://localhost:3001`

## Expected Outcome
- One public URL (e.g. `dsos-demo.onrender.com`) where Scope sees the full interactive dashboard
- Public GitHub repo linked — Scope can browse source code, slash commands, data model, everything
- Password gate on the frontend: simple "enter access code" screen before anything loads
- Access code: `complianceismypassion`
- Full DS-role access — same interactive experience Ron has locally
- Always-on via UptimeRobot ping — no cold starts, instant load every time

## Decisions Made
- **Single service:** Express serves both the API and the built frontend static files. No split hosting.
- **Render free tier:** Free, permanent, no credit card. Cold starts eliminated with UptimeRobot (see step 7).
- **Public repo:** This is a demo/prototype. Simulated data has disclaimer banners. The gitignore already protects real secrets (.env, audit logs). Scope should see the code — it's part of the pitch.
- **Client data committed:** Un-gitignore `/data/clients/` for deployment. The files are simulated with visible disclaimers. They need to exist on the server for the dashboard to populate.
- **Password gate:** Not security — it's access control. Prevents random indexing, creates an intentional moment when Scope opens it. Code shared alongside the link.
- **CORS not needed:** Frontend and API are same origin when served from one Express process.

## Implementation

### 1. Express serves frontend static files
- After all `/api/*` routes, add `express.static()` pointing at `frontend/dist/`
- Add catch-all `*` route that serves `index.html` for client-side routing (React Router)
- Build frontend with `VITE_API_BASE=""` (empty string = same origin)

### 2. Password gate on frontend
- New component: simple full-screen input — "Enter access code"
- Stores in `sessionStorage` so it persists per tab but not forever
- Checked before `AuthProvider` mounts — no API calls until code is entered
- Access code validated client-side (it's a demo gate, not a security boundary)

### 3. Un-gitignore client data
- Remove `/data/clients/` from `.gitignore`
- Verify disclaimer banners are present in all 3 client files (bureau_veritas, intertek, tuv_sud)

### 4. Render deployment config
- Add `render.yaml` (or configure via dashboard):
  - Build command: `cd frontend && npm install && npm run build && cd ../api && npm install`
  - Start command: `cd api && node server.js`
  - Environment: `NODE_ENV=production`, `DSOS_JWT_SECRET` (generate a real one)
- Or: single `Dockerfile` if render.yaml is too limited

### 5. GitHub setup
- Create public repo on GitHub
- Push all code including client data
- Connect Render to the repo for auto-deploy on push

### 6. UptimeRobot keep-alive
- Sign up at UptimeRobot (free)
- Add HTTP monitor: `GET https://[your-app].onrender.com/api/health`
- Interval: every 14 minutes
- Render sleeps after 15min of no traffic — this prevents that. Server stays warm, every visit loads instantly

## Files
- `api/server.js` — add static file serving + catch-all route
- `frontend/src/` — new password gate component
- `frontend/.env.production` — `VITE_API_BASE=` (empty)
- `.gitignore` — un-gitignore `/data/clients/`
- `render.yaml` — deployment config (new file)

## Risks / Notes
- **Cold starts:** Eliminated by UptimeRobot ping every 14 minutes. If UptimeRobot itself goes down (rare), a visitor might wait 30-60s once.
- **Free tier limits:** 750 hours/month = 31 days. One always-on service can't exceed this. Only becomes a concern if a second service is added to the same Render account.
- **No persistent writes:** Render free tier has ephemeral filesystem. Any data written at runtime (audit logs, edit requests) resets on redeploy. Fine for demo — the markdown source files are the real state.
- **Linear integration:** Needs `LINEAR_API_KEY` env var on Render. Without it, edit requests still save locally (graceful degradation already built).
