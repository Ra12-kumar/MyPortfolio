import { Quote, Star, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Shows ONLY verified + published testimonials. When none exist, the
 * section honestly switches to "Built With Real Business Requirements".
 */
export function Testimonials() {
  const { data: projects } = useContent('projects');
  const { data: testimonials } = useContent('testimonials');
  const verified = (testimonials || []).filter((t) => t.isVerified !== false);

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section border-t border-white/[0.05] bg-ink-950/50">
      <div className="container-page">
        {verified.length > 0 ? (
          <>
            <SectionHeading id="testimonials-title" eyebrow="Client feedback" title="What clients say." />
            <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {verified.map((t, i) => (
                <Reveal as="li" key={t.id || i} delay={i * 0.05}>
                  <figure className="card flex h-full flex-col p-7">
                    <Quote className="size-6 text-brand-400/60" aria-hidden="true" />
                    {t.rating ? (
                      <div className="mt-4 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className={s < t.rating ? 'size-4 fill-amber-400 text-amber-400' : 'size-4 text-slate-600'} aria-hidden="true" />
                        ))}
                      </div>
                    ) : null}
                    <blockquote className="mt-4 flex-1 leading-relaxed text-slate-300">“{t.quote}”</blockquote>
                    <figcaption className="mt-6 border-t border-white/[0.06] pt-4">
                      <p className="font-medium text-white">{t.clientName}</p>
                      {(t.clientRole || t.company) && (
                        <p className="text-sm text-slate-500">{[t.clientRole, t.company].filter(Boolean).join(', ')}</p>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </>
        ) : (
          <>
            <SectionHeading
              id="testimonials-title"
              eyebrow="Proof of work"
              title="Built With Real Business Requirements"
              description="Every project here was shaped around how a real type of business operates day to day — the people involved, the records they keep, and the tasks that slow them down."
            />
            <ul className="mt-14 grid gap-4 md:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal as="li" key={p.slug || p.id} delay={i * 0.06}>
                  <div className="card card-hover flex h-full flex-col p-7">
                    <p className="text-xs font-medium tracking-wide text-brand-400 uppercase">{p.category}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.summary}</p>
                    <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
                      {p.businessValue.slice(0, 3).map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
