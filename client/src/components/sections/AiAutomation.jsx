import { Info } from 'lucide-react';
import { aiAutomation } from '@shared/content.js';
import { getIcon } from '@/lib/icons';
import { useInquiry } from '@/context/InquiryContext';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { AiDemo } from '@/components/chat/AiDemo';

export function AiAutomation() {
  const { openInquiry } = useInquiry();

  return (
    <section id="ai" aria-labelledby="ai-title" className="section overflow-hidden border-t border-white/[0.05]">
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-brand-600/10 blur-3xl" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">
              <span className="size-1.5 rounded-full bg-accent-400" /> AI Automation
            </p>
            <h2 id="ai-title" className="mt-5 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Make Your Business <span className="text-gradient">Smarter</span> With AI Automation.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">{aiAutomation.description}</p>
          </Reveal>

          <ul className="mt-9 grid gap-3 sm:grid-cols-2">
            {aiAutomation.useCases.map((u, i) => {
              const Icon = getIcon(u.icon);
              return (
                <Reveal as="li" key={u.title} delay={i * 0.03}>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <Icon className="size-[18px] shrink-0 text-accent-400" aria-hidden="true" />
                    <span className="text-sm text-slate-200">{u.title}</span>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal className="mt-6 flex gap-3 rounded-xl border border-white/[0.06] bg-ink-850/70 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-slate-400">{aiAutomation.note}</p>
          </Reveal>

          <Reveal className="mt-8">
            <Button variant="brand" size="lg" onClick={() => openInquiry('AI Chatbot Integration')}>
              Discuss AI for your business
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <AiDemo />
          <p className="mt-3 text-center text-xs text-slate-500">
            Interactive demo using a sample knowledge base for a fictional business. Responses are pre-defined.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
