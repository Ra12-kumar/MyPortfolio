/**
 * URL helpers. Anything that ends up in an href/src must pass through here so a
 * `javascript:`, `data:` or plain-http URL (from content or configuration) can
 * never reach the DOM.
 */

/** Returns the URL only if it is a well-formed https:// URL, otherwise null. */
export function safeHttpsUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

/** True for API URLs the browser may call: https, or http only for local development. */
export function isAllowedApiUrl(value, { production }) {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:') return true;
    return !production && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
  } catch {
    return false;
  }
}

export const isEmail = (v) => typeof v === 'string' && /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(v) && v.length <= 254;
export const isPhone = (v) => typeof v === 'string' && /^[+\d][\d\s\-().]{5,31}$/.test(v);
