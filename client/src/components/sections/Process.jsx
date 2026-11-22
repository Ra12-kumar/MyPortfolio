import { processSteps } from '@shared/content.js';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section border-t border-white/[0.05] bg-ink-950/50">
      <div className="container-page">
        <SectionHeading
          id="process-title"
          eyebrow="How we'll work together"
          title="A clear, seven-step development process."
          description="You always know what is happening, what comes next, and what you need to decide."
        />

        <ol className="relative mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <Reveal
              as="li"
              key={s.step}
              delay={i * 0.05}
              className={i === processSteps.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''}
            >
              <div className="card card-hover relative h-full overflow-hidden p-6">
                <span
                  className="pointer-events-none absolute -top-4 -right-1 font-mono text-7xl font-semibold text-white/[0.03]"
                  aria-hidden="true"
                >
                  {s.step}
                </span>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-mono text-xs font-semibold text-white">
                    {s.step}
                  </span>
                  {i < processSteps.length - 1 && <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" aria-hidden="true" />}
                </div>
                <h3 className="mt-5 font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
