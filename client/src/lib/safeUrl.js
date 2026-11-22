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

export const isEmail = (v) => typeof v === 'string' && /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(v) && v.length <= 254;
export const isPhone = (v) => typeof v === 'string' && /^[+\d][\d\s\-().]{5,31}$/.test(v);
