import { ArrowUpRight, Check, TrendingUp, Layers } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useInquiry } from '@/context/InquiryContext';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ProjectPreview } from '@/components/mockups/ProjectPreview';
import { GitHubIcon } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/cn';

const typeForProject = {
  gym: 'Business Management System',
  consultancy: 'Business Management System',
  shop: 'E-commerce Website',
};

export function Projects() {
  const { data: projects } = useContent('projects');

  return (
    <section id="projects" aria-labelledby="projects-title" className="section border-t border-white/[0.05]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-brand-600/[0.06] to-transparent" aria-hidden="true" />
      <div className="container-page relative">
        <SectionHeading
          id="projects-title"
          eyebrow="Featured projects"
          title="Real business problems. Complete working solutions."
          description="Each project started with an operational problem — scattered records, missed follow-ups, limited online visibility — and ended as a working application."
        />

        <div className="mt-16 space-y-8 sm:space-y-12">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug || p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }) {
  const { openInquiry } = useInquiry();
  const reversed = index % 2 === 1;
  const number = p.number || String(index + 1).padStart(2, '0');

  return (
    <Reveal>
      <article className="card overflow-hidden p-5 sm:p-8 lg:p-10" aria-labelledby={`project-${p.slug}`}>
        <div className={cn('min-w-children grid items-start gap-8 lg:grid-cols-2 lg:gap-12', reversed && 'lg:[&>*:first-child]:order-2')}>
          <div className="lg:sticky lg:top-24">
            <ProjectPreview project={p} />
            {p.architecture?.length > 0 && (
              <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
                  <Layers className="size-3.5" aria-hidden="true" /> Architecture
                </p>
                <ol className="mt-3 flex flex-wrap items-center gap-2">
                  {p.architecture.map((a, i) => (
                    <li key={a} className="flex items-center gap-2">
                      <span className="rounded-lg border border-white/10 bg-ink-800 px-2.5 py-1 font-mono text-[11px] text-slate-300">{a}</span>
                      {i < p.architecture.length - 1 && <span className="text-slate-600" aria-hidden="true">→</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-brand-400">{number}</span>
              <span className="h-px w-8 bg-white/15" />
              <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">{p.category}</span>
            </div>
            <h3 id={`project-${p.slug}`} className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {p.title}
            </h3>
            <p className="mt-4 leading-relaxed text-slate-400">{p.summary}</p>

            <h4 className="mt-8 text-sm font-semibold text-white">Key features</h4>
            <ul className="mt-3 grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                <TrendingUp className="size-4 text-emerald-300" aria-hidden="true" /> Business value
              </h4>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {p.businessValue.map((b) => (
                  <li key={b} className="text-sm text-slate-300">— {b}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => openInquiry(typeForProject[p.previewKey] || 'Full-Stack Web Application')}>
                Build something similar
              </Button>
              {p.demoUrl && (
                <Button as="a" href={p.demoUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                  Live demo <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              )}
              {p.githubUrl && (
                <Button as="a" href={p.githubUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                  <GitHubIcon className="size-4" /> Source code
                </Button>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
