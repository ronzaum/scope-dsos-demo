# FE-009: "This Week at a Glance" summary card on Overview

**Type:** Feature | **Priority:** Low | **Effort:** Small

## TL;DR
Add a compact summary card at the top of the Overview page that shows the week's highlights at a glance — top 2 priorities, latest notifications/changes, and any notable signals. Keeps the DS oriented without scrolling through the full dashboard.

## Current State
- Overview page opens straight into stat cards and the deployments table
- No quick "what happened today / this week" summary exists
- Signal Feed is at the bottom-right and requires scanning to find what matters

## Expected Outcome
- A new card sits at the **top of the Overview page**, above the existing stat cards
- Content includes:
  - **Top 2 items of the week** (e.g. key milestones, upcoming deadlines, or priority actions across clients)
  - **Today's notifications** (e.g. new issues logged, status changes, interactions)
  - **Latest changes** (e.g. recent client file updates, playbook additions)
- Data is pulled from the existing fake/fallback data for now — can be wired to live state later
- Visually compact: single row or two-column layout, not taller than the stat cards row

## Files
- `frontend/src/pages/Overview.tsx` — add the summary card above the stat cards grid
- `frontend/src/data/fallbacks.ts` — add mock data for the week-at-a-glance content (or derive from existing fallback data)

## Notes
- Keep it lightweight — this is a "nice to have" quality-of-life feature
- Can reuse signal feed data or client deployment data to populate the card initially
- Consider making it collapsible later if it takes too much vertical space
