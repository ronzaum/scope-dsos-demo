import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";

interface AuthState {
  token: string | null;
  connected: boolean;
}

interface AuthContextValue extends AuthState {
  /** Make an authenticated GET to the API. Returns null on failure. */
  apiFetch: <T>(endpoint: string) => Promise<T | null>;
  /** Make an authenticated POST to the API. Returns null on failure. */
  apiPost: <T>(endpoint: string) => Promise<T | null>;
  /** Download a file via authenticated fetch, triggers browser save. */
  apiDownload: (endpoint: string, filename: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  connected: false,
  apiFetch: async () => null,
  apiPost: async () => null,
  apiDownload: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const tokenRef = useRef<string | null>(null);
  const [connected, setConnected] = useState(false);

  // Silent login — no user interaction required
  const login = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "DS", role: "ds" }),
      });
      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      const data = await res.json();
      tokenRef.current = data.token;
      setConnected(true);
    } catch {
      tokenRef.current = null;
      setConnected(false);
    }
  }, []);

  // Authenticate on mount
  useEffect(() => {
    login();
  }, [login]);

  // Authenticated fetch helper. Re-authenticates once on 401.
  const apiFetch = useCallback(async <T,>(endpoint: string): Promise<T | null> => {
    const tryFetch = async (): Promise<T | null> => {
      if (!tokenRef.current) {
        await login();
        if (!tokenRef.current) return null;
      }
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      if (res.status === 401) {
        // Token expired — re-authenticate once
        await login();
        if (!tokenRef.current) return null;
        const retry = await fetch(`${API_BASE}${endpoint}`, {
          headers: { Authorization: `Bearer ${tokenRef.current}` },
        });
        if (!retry.ok) return null;
        return retry.json();
      }
      if (!res.ok) return null;
      return res.json();
    };

    try {
      const result = await tryFetch();
      setConnected(result !== null);
      return result;
    } catch {
      setConnected(false);
      return null;
    }
  }, [login]);

  // Authenticated POST helper. Same re-auth logic as apiFetch.
  const apiPost = useCallback(async <T,>(endpoint: string): Promise<T | null> => {
    const tryPost = async (): Promise<T | null> => {
      if (!tokenRef.current) {
        await login();
        if (!tokenRef.current) return null;
      }
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      if (res.status === 401) {
        await login();
        if (!tokenRef.current) return null;
        const retry = await fetch(`${API_BASE}${endpoint}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${tokenRef.current}` },
        });
        if (!retry.ok) return null;
        return retry.json();
      }
      if (!res.ok) return null;
      return res.json();
    };

    try {
      const result = await tryPost();
      setConnected(result !== null);
      return result;
    } catch {
      setConnected(false);
      return null;
    }
  }, [login]);

  // Authenticated file download — fetches as blob and triggers browser save dialog
  const apiDownload = useCallback(async (endpoint: string, filename: string): Promise<void> => {
    if (!tokenRef.current) {
      await login();
      if (!tokenRef.current) return;
    }
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${tokenRef.current}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [login]);

  return (
    <AuthContext.Provider value={{ token: tokenRef.current, connected, apiFetch, apiPost, apiDownload }}>
      {children}
    </AuthContext.Provider>
  );
}
