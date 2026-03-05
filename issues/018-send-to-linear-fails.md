# FE-018: "Send to Linear" Button Fails With Generic Error

**Type:** Bug | **Priority:** High | **Effort:** Small

## TL;DR

Clicking "Send to Linear" in the template review modal always shows "Failed to create edit request". The error is a generic catch-all — the actual failure reason (network error, missing API key, server not running) is swallowed. Affects all templates.

## Current State

- User clicks "Send to Linear" in the review modal
- `handleSendToLinear` fires a `POST /api/templates/:slug/request-edit` request
- The request fails and the catch block at Templates.tsx:487 fires `toast.error("Failed to create edit request")`
- No issue is created in Linear, no local JSON backup is saved
- The error message gives no indication of what went wrong

## Expected Outcome

- The API call succeeds: Linear issue is created (if `LINEAR_API_KEY` is set) and local JSON backup is always written
- If the API is unreachable, the error message should say so (e.g., "API server not responding")
- If the API returns an error, surface the actual reason from the response body
- Confirm `LINEAR_API_KEY` is documented in `.env.example` for the API

## Likely Root Causes (investigate in order)

1. **API server not running** — the fetch to `${API_BASE}/api/templates/:slug/request-edit` fails at the network level
2. **Missing `LINEAR_API_KEY`** — the endpoint handles this gracefully (returns success with null Linear fields), so this alone shouldn't cause the error
3. **CORS or auth issue** — token might be missing/expired, or CORS not configured for the frontend origin

## Files

- `frontend/src/pages/Templates.tsx` — `handleSendToLinear` function (lines 455-491), review modal UI (lines 670-757)
- `api/server.js` — `POST /api/templates/:slug/request-edit` endpoint (lines 588-657+)

## Notes

- The catch block swallows the error details — at minimum, log `err.message` to console and show a more specific toast
- The API gracefully handles missing LINEAR_API_KEY (line 630-633), so if the server IS running, the request should succeed even without Linear configured
