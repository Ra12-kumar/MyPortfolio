import { ArrowRight, Check } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useInquiry } from '@/context/InquiryContext';
import { getIcon } from '@/lib/icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function Services() {
  const { data: services } = useContent('services');
  const { openInquiry } = useInquiry();

  return (
    <section id="services" aria-labelledby="services-title" className="section">
      <div className="container-page">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="Everything you need to take your business digital."
          description="From a fast business website to a complete management system with AI — scoped around your requirement, built end to end."
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <Reveal as="li" key={s.slug || s.id} delay={(i % 3) * 0.05}>
                <article className="card card-hover group flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 transition group-hover:ring-brand-400/40">
                      <Icon className="size-5 text-brand-300" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-slate-600">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{s.description}</p>
                  {s.features?.length > 0 && (
                    <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-xs text-slate-400">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-brand-400" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => openInquiry(s.projectType)}
                    className="mt-auto inline-flex items-center gap-1.5 self-start pt-7 text-sm font-medium text-brand-300 transition hover:text-white"
                  >
                    Discuss Your Requirement
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </article>
              </Reveal>
            );
          })}
          <Reveal as="li" delay={0.1}>
            <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-white/10 p-7">
              <p className="text-lg font-semibold text-white">Not sure what you need?</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Describe the problem in plain words. I'll recommend the right approach — even if it's smaller than you expected.
              </p>
              <button
                type="button"
                onClick={() => openInquiry('Other')}
                className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium text-white hover:text-brand-300"
              >
                Get a Free Consultation <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
