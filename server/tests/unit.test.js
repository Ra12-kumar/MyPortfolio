import { describe, expect, it } from 'vitest';
import { dedupeHash, looksLikeSpam } from '../src/services/inquiry.service.js';
import { sanitizeText, escapeHtml } from '../src/utils/sanitize.js';
import { testimonialSchema, projectSchema } from '../src/validators/admin.validator.js';
import { buildSystemPrompt } from '../src/services/knowledgeBase.js';
import { resources } from '../src/services/resources.js';

describe('inquiry spam & duplicate protection', () => {
  const base = { description: 'A normal project description here.', email: 'a@b.co' };

  it('flags filled honeypot', () => expect(looksLikeSpam({ ...base, website: 'x' })).toBe(true));
  it('flags forms submitted too quickly', () => {
    const now = Date.now();
    expect(looksLikeSpam({ ...base, formStartedAt: now - 500 }, now)).toBe(true);
  });
  it('flags link-stuffed descriptions', () => {
    expect(looksLikeSpam({ description: 'http://a http://b http://c http://d' })).toBe(true);
  });
  it('accepts normal submissions', () => {
    expect(looksLikeSpam({ ...base, formStartedAt: Date.now() - 30_000 })).toBe(false);
  });
  it('dedupe hash ignores case and whitespace differences', () => {
    expect(dedupeHash({ email: 'A@B.co ', description: 'Hello   World' })).toBe(
      dedupeHash({ email: 'a@b.co', description: 'hello world' }),
    );
  });
});

describe('sanitization', () => {
  it('strips tags and control characters', () => {
    expect(sanitizeText('  <script>alert(1)</script>Hi\u0000 ')).toBe('alert(1)Hi');
  });
  it('escapes HTML', () => {
    expect(escapeHtml('<a href="x">')).toBe('&lt;a href=&quot;x&quot;&gt;');
  });
});

describe('admin validators', () => {
  it('blocks publishing unverified testimonials', () => {
    const r = testimonialSchema.safeParse({ clientName: 'Jane', quote: 'Great work on the project!', isPublished: true, isVerified: false });
    expect(r.success).toBe(false);
  });
  it('requires https links on projects', () => {
    const r = projectSchema.safeParse({
      slug: 'x-y', title: 'Title', category: 'Cat', summary: 'A summary text', demoUrl: 'http://insecure.example',
    });
    expect(r.success).toBe(false);
  });
});

describe('chatbot system prompt', () => {
  it('contains guardrails and approved project content', () => {
    const prompt = buildSystemPrompt({
      services: resources.services.fallback(),
      projects: resources.projects.fallback(),
      faqs: resources.faqs.fallback(),
    });
    expect(prompt).toMatch(/Never invent prices/);
    expect(prompt).toMatch(/You are an AI assistant/);
    expect(prompt).toContain('Consultancy Management System');
  });
});
