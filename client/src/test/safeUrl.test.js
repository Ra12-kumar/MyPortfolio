import { describe, expect, it } from 'vitest';
import { isAllowedApiUrl, isEmail, isPhone, safeHttpsUrl } from '@/lib/safeUrl';

describe('safeHttpsUrl', () => {
  it('accepts https URLs only', () => {
    expect(safeHttpsUrl('https://example.com/demo')).toBe('https://example.com/demo');
    expect(safeHttpsUrl('http://example.com')).toBeNull();
    expect(safeHttpsUrl('javascript:alert(1)')).toBeNull();
    expect(safeHttpsUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(safeHttpsUrl('//evil.example')).toBeNull();
    expect(safeHttpsUrl(undefined)).toBeNull();
  });
});

describe('isAllowedApiUrl', () => {
  it('requires https in production', () => {
    expect(isAllowedApiUrl('https://api.example.com/api/v1', { production: true })).toBe(true);
    expect(isAllowedApiUrl('http://api.example.com', { production: true })).toBe(false);
    expect(isAllowedApiUrl('http://localhost:4000/api/v1', { production: true })).toBe(false);
  });
  it('allows http only for localhost in development', () => {
    expect(isAllowedApiUrl('http://localhost:4000/api/v1', { production: false })).toBe(true);
    expect(isAllowedApiUrl('http://api.example.com', { production: false })).toBe(false);
  });
});

describe('contact value checks', () => {
  it('validates email and phone formats', () => {
    expect(isEmail('ram@example.com')).toBe(true);
    expect(isEmail('x" onmouseover="alert(1)')).toBe(false);
    expect(isPhone('+91 7323891747')).toBe(true);
    expect(isPhone('javascript:alert(1)')).toBe(false);
  });
});
