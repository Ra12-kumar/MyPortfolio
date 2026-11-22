import { describe, expect, it } from 'vitest';
import { isEmail, isPhone, safeHttpsUrl } from '@/lib/safeUrl';

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

describe('contact value checks', () => {
  it('validates email and phone formats', () => {
    expect(isEmail('ram@example.com')).toBe(true);
    expect(isEmail('x" onmouseover="alert(1)')).toBe(false);
    expect(isPhone('+91 7323891747')).toBe(true);
    expect(isPhone('javascript:alert(1)')).toBe(false);
  });
});
