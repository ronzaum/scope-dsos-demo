import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const REFETCH_INTERVAL = 30_000; // 30 seconds

/**
 * Fetches an API endpoint with auth via react-query. Refetches every 30s.
 * Falls back to provided default data when the API is unreachable.
 */
export function useApiData<T>(endpoint: string, fallback: T) {
  const { apiFetch } = useAuth();

  const { data, isLoading } = useQuery<T | null>({
    queryKey: [endpoint],
    queryFn: () => apiFetch<T>(endpoint),
    placeholderData: fallback,
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
  });

  return { data: data ?? fallback, loading: isLoading };
}
