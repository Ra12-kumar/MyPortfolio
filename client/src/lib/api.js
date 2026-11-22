import { site } from '@/config/site';

export class ApiError extends Error {
  constructor(message, { status = 0, code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const apiConfigured = Boolean(site.apiUrl);

/**
 * Small fetch wrapper: JSON in/out, timeout, normalized errors.
 * Returns the `data` field of the API envelope (or the whole body).
 */
export async function api(path, { method = 'GET', body, token, timeout = 15000, raw = false, signal } = {}) {
  if (!site.apiUrl) throw new ApiError('The API is not configured.', { code: 'API_NOT_CONFIGURED' });

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  const timeoutSignal = AbortSignal.timeout(timeout);
  const combined = signal && AbortSignal.any ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  let res;
  try {
    res = await fetch(`${site.apiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal: combined,
    });
  } catch (err) {
    if (err.name === 'AbortError' && signal?.aborted) throw err;
    const timedOut = err.name === 'TimeoutError' || timeoutSignal.aborted;
    throw new ApiError(timedOut ? 'The request timed out. Please try again.' : 'Unable to reach the server. Please check your connection.', {
      code: timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
    });
  }

  if (res.status === 204) return null;

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    /* non-JSON body */
  }

  if (!res.ok) {
    const e = payload?.error || {};
    throw new ApiError(e.message || `Request failed (${res.status})`, { status: res.status, code: e.code, details: e.details });
  }

  return raw ? payload : (payload?.data ?? payload);
}
