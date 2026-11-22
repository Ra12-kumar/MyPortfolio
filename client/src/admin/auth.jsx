import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(null);
const KEY = 'rjk-admin-session';

function readSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY));
    if (s?.accessToken && s.expiresAt * 1000 > Date.now() + 30_000) return s;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Admin session held in sessionStorage (cleared when the tab closes). The
 * token is a Supabase access token; every admin API call is re-authorized
 * server-side (valid JWT + profiles.role = 'admin').
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setSession(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api('/admin/login', { method: 'POST', body: { email, password } });
    try {
      sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
    setSession(data);
    return data;
  }, []);

  // Auto-logout when the token expires.
  useEffect(() => {
    if (!session) return undefined;
    const ms = session.expiresAt * 1000 - Date.now();
    const t = setTimeout(logout, Math.max(ms, 0));
    return () => clearTimeout(t);
  }, [session, logout]);

  /** Authenticated API call; logs out on 401/403. */
  const request = useCallback(
    async (path, options = {}) => {
      try {
        return await api(`/admin${path}`, { ...options, token: session?.accessToken });
      } catch (err) {
        if (err.status === 401 || err.status === 403) logout();
        throw err;
      }
    },
    [session, logout],
  );

  const value = useMemo(() => ({ session, user: session?.user, login, logout, request }), [session, login, logout, request]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
