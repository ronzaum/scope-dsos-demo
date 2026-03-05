# FE-003: Wire up existing ClientData type across components

**Type:** Improvement | **Priority:** Medium | **Effort:** Medium

## TL;DR
A proper `ClientData` interface exists in `data/clients.ts` but every component that consumes client data uses `any`. ~30 of the 40 `any` instances in the frontend are client-related.

## Current State
- `ClientData` interface defined at `frontend/src/data/clients.ts:1-57` with full coverage
- All 6 client tab components take `{ client: any }` as props
- `ClientQuickView` uses `useState<any>(null)`
- `ClientDetail` uses `useApiData<any>`
- Every `.map()` callback types items as `any`

## Expected Outcome
- Client tab components typed: `{ client: ClientData }`
- `useApiData<ClientData>` in ClientDetail and ClientQuickView
- Map callbacks typed with sub-interfaces (e.g., issue, interaction, stakeholder)
- Note: API response shape may differ slightly from `ClientData` — may need a separate `ClientApiResponse` interface or adapt the existing one

## Files
- `frontend/src/data/clients.ts` — source interface, may need adaptation
- `frontend/src/pages/ClientDetail.tsx`
- `frontend/src/components/ClientQuickView.tsx`
- `frontend/src/components/client/ClientOverviewTab.tsx`
- `frontend/src/components/client/ClientConstraintMapTab.tsx`
- `frontend/src/components/client/ClientDeploymentPlanTab.tsx`
- `frontend/src/components/client/ClientIssuesTab.tsx`
- `frontend/src/components/client/ClientInteractionsTab.tsx`
- `frontend/src/components/client/ClientStakeholdersTab.tsx`

## Approach
1. Check API response shape against existing `ClientData` interface
2. Adapt or create API-specific interface if needed
3. Type the 6 tab component props
4. Type `useApiData` generics and inline callbacks

## Risk
Low. Type-only changes — no runtime behaviour change. May surface type mismatches between API and fallback data that are worth knowing about.
