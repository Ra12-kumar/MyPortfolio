import { Bot, Library, Plug, Workflow, FileSearch } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { AIBrain3D } from '@/components/three/AIBrain3D';

const highlights = [
  { icon: Bot, title: 'AI Chatbots', text: 'Assistants that answer customer questions and qualify leads.' },
  { icon: Library, title: 'Retrieval-Augmented Generation (RAG)', text: 'Answers grounded in your own documents and data.' },
  { icon: Plug, title: 'AI API Integration', text: 'LLM providers wired in securely, with server-side keys.' },
  { icon: Workflow, title: 'Intelligent Automation', text: 'Repetitive business workflows handled automatically.' },
  { icon: FileSearch, title: 'Document-Based Question Answering', text: 'Ask questions of PDFs, manuals and knowledge bases.' },
];

export function AiExpertise() {
  return (
    <section id="ai-expertise" aria-labelledby="ai-expertise-title" className="section overflow-hidden border-t border-white/[0.05]">
      <div className="pointer-events-none absolute top-1/2 right-0 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-accent-500/10 blur-3xl" aria-hidden="true" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className="eyebrow">
              <span className="size-1.5 rounded-full bg-accent-400" /> AI expertise
            </p>
            <h2
              id="ai-expertise-title"
              className="mt-5 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              Building <span className="text-gradient">Intelligent Solutions</span> with AI
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
              I add practical AI to real products — not demos. From customer-facing assistants to document search, the focus is on
              reliable, secure features that save your team time.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-3">
            {highlights.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.04}>
                <div className="glass flex items-start gap-3.5 rounded-xl px-4 py-3.5">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-500/25 to-accent-500/25 ring-1 ring-white/10">
                    <Icon className="size-4 text-brand-300" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="mt-0.5 text-sm text-slate-400">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="order-1 flex justify-center lg:order-2" delay={0.1}>
          <AIBrain3D />
        </Reveal>
      </div>
    </section>
  );
}
