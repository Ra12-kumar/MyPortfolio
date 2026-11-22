import { about, skills, profile } from '@shared/content.js';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useInquiry } from '@/context/InquiryContext';
import { Button } from '@/components/ui/Button';

export function About() {
  const { openInquiry } = useInquiry();
  const hasLearning = skills.some((g) => g.items.some((i) => i.learning));

  return (
    <section id="about" aria-labelledby="about-title" className="section bg-paper-50 text-slate-700">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading id="about-title" eyebrow="About me" title={about.headline} align="left" tone="light" />
          <Reveal className="mt-8 space-y-5 text-base leading-relaxed sm:text-[17px]">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          {about.workLinks?.length > 0 && (
            <Reveal className="mt-8">
              <p className="text-sm font-medium text-ink-900">My work, live — and many more</p>
              <ul className="mt-3 flex flex-wrap gap-3">
                {about.workLinks.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-paper-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-600 shadow-sm hover:border-brand-600"
                    >
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          <Reveal className="mt-8 rounded-2xl border border-paper-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-ink-900">What I aim for in every project</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{profile.longIntroduction[2]}</p>
          </Reveal>
          <Reveal className="mt-8">
            <Button variant="dark" onClick={() => openInquiry()}>Get a Free Consultation</Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-paper-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-lg font-semibold text-ink-900">Technical expertise</h3>
              {hasLearning && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="size-2 rounded-full border border-dashed border-slate-400" /> currently learning
                </span>
              )}
            </div>
            <dl className="mt-6 divide-y divide-paper-200">
              {skills.map((group) => (
                <div key={group.group} className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[110px_1fr]">
                  <dt className="text-sm font-semibold text-brand-600">{group.group}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {group.items.map((s) => (
                      <span
                        key={s.name}
                        className={
                          s.learning
                            ? 'rounded-lg border border-dashed border-slate-300 px-2.5 py-1 text-sm text-slate-500'
                            : 'rounded-lg border border-paper-200 bg-paper-50 px-2.5 py-1 text-sm text-slate-700'
                        }
                        title={s.learning ? 'Currently learning' : undefined}
                      >
                        {s.name}
                        {s.learning && <span className="sr-only"> (currently learning)</span>}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
