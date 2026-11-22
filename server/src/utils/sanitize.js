// Removes control characters (except tab/newline/carriage return) and HTML
// tags from user-supplied text. Content is always rendered as text on the
// frontend; this is defence in depth for e-mails, exports and admin views.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const TAGS = /<\/?[a-z][^>]*>/gi;

export function sanitizeText(value) {
  if (typeof value !== 'string') return value;
  return value.replace(CONTROL_CHARS, '').replace(TAGS, '').trim();
}

/** Recursively sanitizes every string inside a plain object/array. */
export function sanitizeDeep(input) {
  if (typeof input === 'string') return sanitizeText(input);
  if (Array.isArray(input)) return input.map(sanitizeDeep);
  if (input && typeof input === 'object') {
    return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, sanitizeDeep(v)]));
  }
  return input;
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
