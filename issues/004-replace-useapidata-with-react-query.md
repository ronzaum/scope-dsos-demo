# FE-004: Replace useApiData with react-query

**Type:** Improvement | **Priority:** Medium | **Effort:** Medium

## TL;DR
`@tanstack/react-query` is installed and the `QueryClientProvider` wraps the app, but nothing uses it. All fetching goes through a custom `useApiData` hook that polls every 5 seconds unconditionally. The Playbook page alone makes 36 requests/min.

## Current State
- `useApiData` hook polls every 5s via `setInterval` (line 4)
- No request deduplication — same endpoint fetched by multiple components = duplicate requests
- `fallback` in useCallback dependency array — fragile to inline object callers
- react-query (`@tanstack/react-query`) is a dead dependency (~13KB) — imported in App.tsx but never used

## Expected Outcome
- `useApiData` refactored to use `useQuery` internally
- Configurable `staleTime` and `refetchInterval` per endpoint (default 30-60s, not 5s)
- Automatic request deduplication for shared endpoints
- Fallback data passed as `placeholderData` to react-query
- `apiFetch` from AuthContext used as the `queryFn`

## Files
- `frontend/src/hooks/useApiData.ts` — rewrite internals
- `frontend/src/contexts/AuthContext.tsx` — no changes, `apiFetch` stays as-is

## Approach
Keep the `useApiData(endpoint, fallback)` signature so callers don't change. Internally:
```ts
export function useApiData<T>(endpoint: string, fallback: T) {
  const { apiFetch } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => apiFetch<T>(endpoint),
    placeholderData: fallback,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
  return { data: data ?? fallback, loading: isLoading };
}
```

## Risk
Low-medium. Same external API, same hook signature. Test that fallback behaviour still works when API is down. Verify auth token refresh still triggers correctly through react-query's retry logic.
