import { z } from 'zod';

export const CHAT_LIMITS = {
  maxMessages: 24, // per request (whole visible conversation)
  maxMessageLength: 1000,
  maxTotalChars: 12000,
  contextMessages: 12, // how many recent messages are sent to the LLM
};

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(CHAT_LIMITS.maxMessageLength),
      }),
    )
    .min(1)
    .max(CHAT_LIMITS.maxMessages, 'This conversation is too long. Please start a new chat or use the contact form.')
    .refine((m) => m.length > 0 && m[m.length - 1]?.role === 'user','The last message must be from the user')
    .refine(
      (m) => m.reduce((n, x) => n + x.content.length, 0) <= CHAT_LIMITS.maxTotalChars,
      'This conversation is too long. Please start a new chat.',
    ),
});
