import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X, MessageCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { ragReply } from '@/lib/rag/ragChat';
import { useInquiry } from '@/context/InquiryContext';
import { cn } from '@/lib/cn';

const WELCOME =
  'Hi! Welcome to my portfolio. Are you looking to build a website, automate your business, or develop a custom software solution? I can help you understand how we can get started.';

const SUGGESTIONS = ['What services do you offer?', 'Tell me about the gym management system', 'How much does a project cost?', 'Can you add an AI chatbot to my site?'];

const MAX_USER_MESSAGES = 12; // matches server-side conversation limits
const STORAGE_KEY = 'rjk-chat-v1';

const initialMessages = [{ role: 'assistant', content: WELCOME }];

function loadMessages() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : initialMessages;
  } catch {
    return initialMessages;
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const { openInquiry } = useInquiry();

  const userCount = messages.filter((m) => m.role === 'user').length;
  const limitReached = userCount >= MAX_USER_MESSAGES;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [open, messages, pending]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (text) => {
    const content = text.trim().slice(0, 1000);
    if (!content || pending || limitReached) return;
    setError(null);
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');

    setPending(true);
    try {
      // The assistant runs in the browser over Ram's approved knowledge base — nothing is sent to a server.
      // Only role/content are used; the welcome message is UI-only.
      const payload = next.slice(1).map(({ role, content: c }) => ({ role, content: c }));
      const data = ragReply(payload);
      await new Promise((resolve) => setTimeout(resolve, 350)); // brief typing indicator
      setMessages((m) => [...m, { role: 'assistant', content: data.reply, suggestInquiry: data.suggestInquiry }]);
    } catch {
      setError('The assistant is unavailable right now.');
      // Roll back the unanswered message so the user can retry.
      setMessages((m) => m.slice(0, -1));
      setInput(content);
    } finally {
      setPending(false);
    }
  };

  const goToForm = () => {
    setOpen(false);
    openInquiry();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[60] flex max-h-[min(640px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/60 sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[400px] sm:max-w-[calc(100vw-3rem)]"
          >
            <header className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
                <Bot className="size-5 text-white" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p id="chat-title" className="text-sm font-semibold text-white">RJK AI Assistant</p>
                <p className="text-xs text-slate-500">AI assistant · may make mistakes</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMessages(initialMessages);
                  setError(null);
                }}
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Start a new conversation"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close assistant"
              >
                <X className="size-4" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
                  <p
                    className={cn(
                      'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line',
                      m.role === 'user' ? 'rounded-br-sm bg-brand-600 text-white' : 'rounded-bl-sm bg-white/[0.06] text-slate-200',
                    )}
                  >
                    {m.content}
                  </p>
                  {m.suggestInquiry && (
                    <button
                      type="button"
                      onClick={goToForm}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-200 hover:bg-brand-500/20"
                    >
                      Open project inquiry form <ArrowRight className="size-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
              {pending && (
                <div className="flex gap-1 px-1 py-2" aria-label="Assistant is typing">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1.5 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: `${d * 120}ms` }} />
                  ))}
                </div>
              )}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-left text-xs text-slate-300 hover:border-brand-400/50 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="mx-4 mb-2 rounded-lg bg-rose-400/10 px-3 py-2 text-xs text-rose-200" role="alert">
                {error}{' '}
                <button type="button" onClick={goToForm} className="underline">Use the inquiry form</button>
              </p>
            )}

            {limitReached ? (
              <div className="border-t border-white/[0.06] p-4 text-center text-sm text-slate-400">
                You&apos;ve reached the chat limit for this conversation.{' '}
                <button type="button" onClick={goToForm} className="font-medium text-brand-300 underline">
                  Send a project inquiry
                </button>
              </div>
            ) : (
              <form
                className="flex gap-2 border-t border-white/[0.06] p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <label htmlFor="chat-input" className="sr-only">Message RJK AI Assistant</label>
                <input
                  ref={inputRef}
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={1000}
                  placeholder="Ask about services, projects, process…"
                  className="field"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close RJK AI Assistant' : 'Open RJK AI Assistant'}
        className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[60] flex h-13 items-center gap-2 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 pr-5 pl-4 text-sm font-medium text-white shadow-xl shadow-brand-900/40 ring-1 ring-white/20 transition hover:brightness-110 sm:right-6 sm:bottom-6"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <MessageCircle className="size-5" aria-hidden="true" />}
        <span className={cn(open && 'sr-only sm:not-sr-only')}>{open ? 'Close' : 'Ask AI'}</span>
      </button>
    </>
  );
}
