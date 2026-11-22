import { capabilities } from '@shared/content.js';
import { getIcon } from '@/lib/icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function Trust() {
  return (
    <section aria-labelledby="trust-title" className="section border-t border-white/[0.05]">
      <div className="container-page">
        <SectionHeading
          id="trust-title"
          eyebrow="Expertise"
          title="Technology That Solves Real Business Problems."
          description="Every capability below exists for one reason: to remove friction from how your business runs."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => {
            const Icon = getIcon(c.icon);
            return (
              <Reveal as="li" key={c.title} delay={i * 0.04} className={i === capabilities.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <div className="card card-hover h-full p-6">
                  <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/10 ring-1 ring-white/10">
                    <Icon className="size-5 text-brand-300" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-medium text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
