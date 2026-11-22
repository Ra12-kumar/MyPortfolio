/**
 * Retrieval-Augmented assistant that answers ONLY from the approved knowledge
 * base in ./knowledge.js.
 *
 *   retrieve  -> BM25 search over the in-memory chunks (see retriever.js)
 *   augment   -> pick the best-matching approved passage
 *   respond   -> reply with that passage's approved wording (extractive; no
 *                text is generated, so nothing can be invented)
 *
 * When nothing in the knowledge base matches, the assistant says so and hands
 * over to Ram. Project enquiries are collected one question at a time.
 * No database is used and nothing from the chat is stored.
 */
import { chunks, intake, CONTACT_SHORT, WELCOME } from './knowledge.js';
import { buildIndex, search, tokenize } from './retriever.js';

const index = buildIndex(chunks);

/** Set CHAT_RAG=off to restore the original (pre-RAG) chat behaviour. */
export const ragEnabled = () => String(process.env.CHAT_RAG ?? 'on').toLowerCase() !== 'off';

const MAX_INTAKE_QUESTIONS = 4;
const SUMMARY_PREFIX = "Thanks! Here's what you've shared so far:";
const CONFIRM = /^\s*(yes|yeah|yep|correct|right|ok(ay)?|sure|accurate|looks (good|right|accurate)|that'?s (right|correct|accurate))\b/i;
const SUGGEST_FORM_FOR = new Set([
  'contact', 'not-provided', 'enquiry-details', 'faq-start', 'faq-price', 'faq-timeline',
  'faq-speak', 'faq-location', 'faq-maintenance',
]);

const SERVICE_PATTERNS = [
  ['chatbot', /\b(chat ?bots?|rag|ai assistants?|ai agents?|knowledge base|document q&a)\b|\bai\b.*\b(bot|assistant|chat)\b/i],
  ['automation', /\b(automat\w*|workflows?)\b/i],
  ['api', /\b(apis?|integrat\w*|databases?|third[- ]party)\b/i],
  ['webapp', /\b(web ?apps?|applications?|dashboards?|management systems?|portal|crm|booking system|inventory|admin panel|full[- ]?stack|software)\b/i],
  ['website', /\b(web ?sites?|landing pages?|portfolio sites?|online presence|business sites?)\b/i],
];

const NEED_PATTERN = /\b(i|we)\b.*\b(need|want|require|looking|planning|would like|wish)\b|\b(can|could) you (build|make|create|develop|design)\b|\bneed an?\b|\bwant an?\b|\blooking for\b|\b(build|create|develop|make) (me|us|a|an|my|our)\b|\bhelp me\b/i;
const GREETING = /^\s*(hi|hello|hey|namaste|good (morning|afternoon|evening))\b[\s!.,]*$/i;
const STOP_INTAKE = /^\s*(no|nope|nothing( else)?|that'?s (all|it|enough)|that is all|done|skip|stop|not now|no thanks?|nothing more)\b/i;
const QUESTION_START = /^\s*(what|how|why|can|could|do|does|is|are|will|where|who|which|when)\b/i;
const SENSITIVE = /\b(password|passcode|otp|one[- ]time (code|password)|cvv|card number|credit card|debit card|bank account|api[- ]?key|secret key|private key|token)\b/i;
const PROBING = /\b(ignore (all |the |your |any )?(previous|prior|above|earlier)|system prompt|your (instructions|prompt|rules)|reveal .*(prompt|instructions)|developer mode|jailbreak)\b/i;

const detectService = (text) => SERVICE_PATTERNS.find(([, re]) => re.test(text))?.[0] ?? null;
const isQuestion = (text) => /\?\s*$/.test(text) || QUESTION_START.test(text);

const byId = new Map(chunks.map((c) => [c.id, c]));

const result = (reply, sources = [], suggestInquiry = false) => ({ reply, source: 'rag', sources, suggestInquiry });

/** Which intake question (if any) does this assistant message contain? */
function askedQuestion(text) {
  for (const [key, svc] of Object.entries(intake)) {
    const i = svc.questions.findIndex((q) => text.includes(q));
    if (i !== -1) return { key, question: svc.questions[i] };
  }
  return null;
}

/** Retrieves the best approved passage, or null when nothing matches well enough. */
function retrieve(query) {
  const hits = search(index, query, 3);
  const top = hits[0];
  if (!top) return null;
  // Require a meaningful share of the query's words to match, so unrelated
  // questions are handed over instead of answered with a loosely related passage.
  if (top.matched < Math.max(1, Math.ceil(top.terms * 0.6))) return null;
  return top.chunk;
}

function handoff() {
  return result(
    `I don't have that in my knowledge base, so I can't answer it reliably. I can help with website development, full-stack web applications, AI chatbots and RAG, API and database integration, and business automation. For anything else, please contact Ram directly — ${CONTACT_SHORT}.`,
    ['handoff'],
    true,
  );
}

function pickService() {
  return result(
    'Which service are you interested in: a website, a full-stack web application, an AI chatbot/RAG solution, an API or database integration, business automation, or something else?',
    ['flow'],
  );
}

/** Pairs each intake question the assistant asked with the user's reply. */
function collectAnswers(messages) {
  const pairs = [];
  for (let i = 0; i < messages.length - 1; i += 1) {
    if (messages[i].role !== 'assistant' || messages[i].content.startsWith(SUMMARY_PREFIX)) continue;
    const asked = askedQuestion(messages[i].content);
    const next = messages[i + 1];
    // if the same question is asked again afterwards, the reply in between was not an answer
    const reAsked = Boolean(asked) && messages[i + 2]?.role === 'assistant' && messages[i + 2].content.includes(asked.question);
    if (asked && next.role === 'user' && !reAsked && !STOP_INTAKE.test(next.content)) {
      pairs.push({ key: asked.key, question: asked.question, answer: next.content.trim().slice(0, 240) });
    }
  }
  return pairs;
}

function summary(key, pairs) {
  const lines = pairs.map((p) => `- ${p.question} ${p.answer}`).join('\n');
  return result(
    `${SUMMARY_PREFIX}\nService: ${intake[key].label}\n${lines}\n\nDoes that look accurate? Tell me if anything should change.\n\nScope, timeline and pricing need Ram's review before anything is confirmed. If you'd like Ram to follow up, the project inquiry form lets you leave your name and preferred contact method (I don't save details in this chat). You can also reach Ram directly — ${CONTACT_SHORT}.`,
    [intake[key].chunk, 'summary'],
    true,
  );
}

function nextQuestion(key, messages) {
  const used = messages.filter((m) => m.role === 'assistant').map((m) => m.content).join('\n');
  return intake[key].questions.find((q) => !used.includes(q)) ?? null;
}

/**
 * Builds the assistant reply for the conversation, or `null` when RAG mode is
 * switched off (CHAT_RAG=off) so the caller can use its previous behaviour.
 */
export function ragReply(messages) {
  if (!ragEnabled()) return null;

  const text = messages[messages.length - 1].content.trim();
  const previous = messages.length > 1 ? messages[messages.length - 2] : null;

  // --- safety: never take secrets, never expose internals -------------------
  if (SENSITIVE.test(text)) {
    return result(
      `Please don't share passwords, OTPs, payment card details, API keys or other sensitive information in this chat — I never need them. Tell me about your project instead, or contact Ram directly — ${CONTACT_SHORT}.`,
      ['safety'],
      true,
    );
  }
  if (PROBING.test(text)) {
    return result(
      "I can't share internal instructions or credentials, and I only answer from Ram's approved information. I can help with website development, full-stack applications, AI chatbots and RAG, API integration, and automation. What are you looking to build?",
      ['safety'],
    );
  }

  if (GREETING.test(text)) return result(WELCOME, ['welcome']);

  // --- project enquiry in progress: continue one question at a time ----------
  const afterSummary = previous?.role === 'assistant' && previous.content.startsWith(SUMMARY_PREFIX);
  if (afterSummary && CONFIRM.test(text)) {
    return result(
      `Great! The next step is to send Ram your details through the project inquiry form, or contact Ram directly — ${CONTACT_SHORT}. Scope, timeline and pricing will be confirmed after Ram reviews your requirements.`,
      ['summary'],
      true,
    );
  }
  const pending = previous?.role === 'assistant' && !afterSummary ? askedQuestion(previous.content) : null;
  if (pending) {
    const { key, question } = pending;
    if (STOP_INTAKE.test(text)) return summary(key, collectAnswers(messages));

    if (isQuestion(text)) {
      const chunk = retrieve(text);
      return result(
        chunk
          ? `${chunk.answer}\n\nBack to your project: ${question}`
          : `Sorry, I may not have been clear. ${question}`,
        chunk ? [chunk.id] : ['flow'],
        chunk ? SUGGEST_FORM_FOR.has(chunk.id) : false,
      );
    }

    const pairs = collectAnswers(messages); // includes this answer
    const next = nextQuestion(key, messages);
    if (!next || pairs.length >= MAX_INTAKE_QUESTIONS) return summary(key, pairs);
    return result(next, [intake[key].chunk, 'flow']);
  }

  // --- retrieval ---------------------------------------------------------------
  const service = detectService(text);
  const wantsToStart = service && (NEED_PATTERN.test(text) || (!isQuestion(text) && text.split(/\s+/).length <= 6));
  const chunk = retrieve(text);

  if (!chunk) {
    if (service) {
      // e.g. "I need an application" — a known service but too few words to rank a passage.
      const svc = intake[service];
      return result(`${byId.get(svc.chunk).answer}\n\n${svc.questions[0]}`, [svc.chunk, 'flow'], true);
    }
    return tokenize(text).length ? handoff() : pickService();
  }

  let reply = chunk.answer;
  const sources = [chunk.id];
  if (wantsToStart && !nextQuestionAsked(messages, service)) {
    reply += `\n\n${intake[service].questions[0]}`;
    sources.push('flow');
  }
  return result(reply, sources, SUGGEST_FORM_FOR.has(chunk.id) || Boolean(wantsToStart));
}

function nextQuestionAsked(messages, key) {
  return nextQuestion(key, messages) !== intake[key].questions[0];
}
