import { describe, expect, it } from 'vitest';
import { inquirySchema, inquiryDefaults } from '@/lib/inquirySchema';

const valid = {
  ...inquiryDefaults,
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  projectType: 'Business Website',
  description: 'We need a website for our wholesale business with a product catalog.',
};

describe('inquirySchema', () => {
  it('accepts a minimal valid inquiry', () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it('requires a project type', () => {
    const r = inquirySchema.safeParse({ ...valid, projectType: '' });
    expect(r.success).toBe(false);
    expect(r.error.issues[0].path).toEqual(['projectType']);
  });

  it('requires a meaningful description', () => {
    expect(inquirySchema.safeParse({ ...valid, description: 'too short' }).success).toBe(false);
  });

  it('rejects invalid emails and phone numbers', () => {
    expect(inquirySchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, phone: 'call me' }).success).toBe(false);
  });

  it('requires a phone number when WhatsApp or Phone is preferred', () => {
    const r = inquirySchema.safeParse({ ...valid, preferredContact: 'WhatsApp' });
    expect(r.success).toBe(false);
    expect(r.error.issues[0].path).toEqual(['phone']);
    expect(inquirySchema.safeParse({ ...valid, preferredContact: 'WhatsApp', phone: '+1 555 123 4567' }).success).toBe(true);
  });
});
