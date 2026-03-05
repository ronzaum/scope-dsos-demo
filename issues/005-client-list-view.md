# FE-005: Add client list/index page with card grid

**Type:** Feature | **Priority:** High | **Effort:** Medium

## TL;DR
The Clients tab currently drops the user straight into a single client's detail view with no way to discover or navigate to other clients. Need a list page showing all clients as summary cards, with click-through to the full detail page.

## Current State
- Clicking "Clients" in the sidebar loads `ClientDetail.tsx` for one hardcoded/first client
- No `/clients` index route — no way to see all available clients
- API already supports `GET /api/clients` returning all clients
- 3 client files exist in `/data/clients/` (Bureau Veritas, Intertek, TÜV SÜD)

## Expected Outcome
- `/clients` route renders a grid/list of client ID cards
- Each card shows top-level info: name, sector, deployment stage, phase, adoption %, active issues count
- Clicking a card navigates to `/clients/:slug` for the full detail page
- Detail page gets a back button/breadcrumb to return to the list

## Files
- `frontend/src/pages/ClientList.tsx` — new page (client card grid)
- `frontend/src/pages/ClientDetail.tsx` — add slug param, back navigation
- `frontend/src/App.tsx` — add `/clients` and `/clients/:slug` routes

## Notes
- The API data is live — reads from `/data/clients/*.md` and auto-refreshes on file changes
- Card design should match the existing UI style (shadcn components)
- Consider reusing the profile/commercial/deployment summary logic already in `ClientOverviewTab.tsx`
