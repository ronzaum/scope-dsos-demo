# FE-002: Replace hardcoded API URL with environment variable

**Type:** Improvement | **Priority:** High | **Effort:** Small

## TL;DR
`AuthContext.tsx` hardcodes `http://localhost:3001` as the API base. The frontend will break in any non-local environment.

## Current State
- Line 3: `const API_BASE = "http://localhost:3001";`
- No `.env` files exist in the frontend directory
- Vite supports `import.meta.env.VITE_*` out of the box

## Expected Outcome
- API base URL read from `import.meta.env.VITE_API_BASE`
- `.env` file with `VITE_API_BASE=http://localhost:3001` for local dev
- `.env.example` committed with placeholder value
- `.env` added to `.gitignore`

## Files
- `frontend/src/contexts/AuthContext.tsx` — line 3
- `frontend/.env` (new)
- `frontend/.env.example` (new)
- `frontend/.gitignore` (update)

## Risk
Low. Single variable swap. Test that auth still works after the change.
