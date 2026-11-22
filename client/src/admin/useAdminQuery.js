import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './auth';

/** Fetches an admin endpoint with loading / error state and a reload function. */
export function useAdminQuery(path) {
  const { request } = useAuth();
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await request(path);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err.message });
    }
  }, [request, path]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load, setData: (fn) => setState((s) => ({ ...s, data: typeof fn === 'function' ? fn(s.data) : fn })) };
}
