import { whyMe } from '@shared/content.js';
import { getIcon } from '@/lib/icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function WhyMe() {
  return (
    <section aria-labelledby="why-title" className="section border-t border-white/[0.05]">
      <div className="container-page">
        <SectionHeading
          id="why-title"
          eyebrow="Why work with me"
          title={whyMe.headline}
          description="No hand-offs between agencies, freelancers and hosting providers. One person who understands the whole picture."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {whyMe.items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 0.04}
                className="group relative bg-ink-850 p-7 transition hover:bg-ink-800 sm:p-8"
              >
                <Icon className="size-6 text-brand-300 transition group-hover:text-accent-400" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
