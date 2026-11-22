import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Zap, RotateCcw } from 'lucide-react';
import { answerDemo, demoBusiness, demoSuggestions } from './demoKnowledgeBase';
import { cn } from '@/lib/cn';

const initial = [
  { role: 'assistant', content: `Hi! I'm the virtual assistant for ${demoBusiness.name}. Ask me about hours, plans, trainers or booking a trial.` },
];

export function AiDemo() {
  const [messages, setMessages] = useState(initial);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const timer = useRef();

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const ask = (text) => {
    const q = text.trim().slice(0, 300);
    if (!q || typing) return;
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setInput('');
    setTyping(true);
    timer.current = setTimeout(() => {
      const { answer, action } = answerDemo(q);
      setMessages((m) => [...m, { role: 'assistant', content: answer, action }]);
      setTyping(false);
    }, 650);
  };

  return (
    <div className="card relative flex h-[520px] flex-col overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
          <Bot className="size-5 text-white" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{demoBusiness.name} · Assistant</p>
          <p className="truncate text-xs text-slate-500">{demoBusiness.note}</p>
        </div>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-200 uppercase">
          Demo
        </span>
        <button
          type="button"
          onClick={() => setMessages(initial)}
          className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
          aria-label="Reset demo conversation"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}
            >
              <p
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  m.role === 'user' ? 'rounded-br-sm bg-brand-600 text-white' : 'rounded-bl-sm bg-white/[0.06] text-slate-200',
                )}
              >
                {m.content}
              </p>
              {m.action && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300">
                  <Zap className="size-3" aria-hidden="true" /> {m.action}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex gap-1 px-1" aria-label="Assistant is typing">
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-1.5 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: `${d * 120}ms` }} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.06] p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {demoSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-brand-400/50 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex gap-2"
        >
          <label htmlFor="ai-demo-input" className="sr-only">Ask the demo assistant</label>
          <input
            id="ai-demo-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={300}
            placeholder="Ask the demo assistant…"
            className="field"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-500 disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
