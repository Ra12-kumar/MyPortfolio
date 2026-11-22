import { describe, expect, it } from 'vitest';
import { answerDemo } from '@/components/chat/demoKnowledgeBase';

describe('AI demo knowledge base', () => {
  it('answers known questions and labels them as demo data', () => {
    expect(answerDemo('What are your opening hours?').answer).toMatch(/demo/i);
  });
  it('captures booking intents', () => {
    expect(answerDemo('Can I book a trial session?').action).toBe('Booking request captured');
  });
  it('hands over to a human when asked', () => {
    expect(answerDemo('I want to talk to a person').action).toBe('Handed over to a human');
  });
  it('admits when it does not know', () => {
    expect(answerDemo('What is the capital of France?').answer).toMatch(/not sure/i);
  });
});
