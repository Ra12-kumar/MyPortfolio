import { config } from '../config/env.js';
import { logger } from '../config/logger.js';
import { CHAT_LIMITS } from '../validators/chat.validator.js';
import { buildSystemPrompt, getKnowledge } from './knowledgeBase.js';
import { fallbackReply } from './chatFallback.js';
import { ragReply } from './rag/ragChat.js';

const INQUIRY_PATTERN = /(inquiry form|contact form|project inquiry|contact section)/i;

async function callLlm(systemPrompt, messages) {
  const res = await fetch(`${config.LLM_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.LLM_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.LLM_MODEL,
      max_tokens: config.LLM_MAX_TOKENS,
      temperature: 0.3,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
    signal: AbortSignal.timeout(config.LLM_TIMEOUT_MS),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`LLM provider responded ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('LLM provider returned an empty response');
  return reply;
}

/**
 * Produces an assistant reply. Uses the configured LLM when available, and
 * falls back to rule-based answers from approved content otherwise.
 */
export async function generateReply(messages) {
  // RAG over the approved knowledge base (in-memory, no database). CHAT_RAG=off disables it.
  const rag = ragReply(messages);
  if (rag) return rag;

  const knowledge = await getKnowledge();
  const lastUser = messages[messages.length - 1].content;
  const context = messages.slice(-CHAT_LIMITS.contextMessages);

  if (config.llmEnabled) {
    try {
      const reply = await callLlm(buildSystemPrompt(knowledge), context);
      return { reply, source: 'ai', suggestInquiry: INQUIRY_PATTERN.test(reply) };
    } catch (err) {
      logger.warn({ err: err.message }, 'LLM call failed; using fallback responder');
    }
  }

  const fb = fallbackReply(lastUser, knowledge);
  return { ...fb, source: 'fallback' };
}
