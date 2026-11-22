import { Link } from 'react-router-dom';
import { ArrowUpRight, User, Layers, FolderKanban, Workflow, MessageSquareQuote, Send } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { pages } from '../routes';
import { Tilt3D } from '../three/Tilt3D';

const icons = {
  '/about': User,
  '/services': Layers,
  '/projects': FolderKanban,
  '/process': Workflow,
  '/testimonials': MessageSquareQuote,
  '/contact': Send,
};

/** Home-page grid of 3D tilt cards linking to each page. */
export function ExploreGrid() {
  const items = pages.filter((p) => p.path !== '/');
  return (
    <section aria-labelledby="explore-title" className="section border-t border-white/[0.05]">
      <div className="container-page">
        <SectionHeading
          id="explore-title"
          eyebrow="Explore"
          title="Everything you need to decide, one click away."
          description="See what I build, how I work, and how to get started."
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const Icon = icons[p.path];
            return (
              <Reveal as="li" key={p.path} delay={i * 0.05}>
                <Tilt3D className="h-full">
                  <Link
                    to={p.path}
                    className="card group relative flex h-full flex-col p-7 transition hover:border-brand-400/30 [transform-style:preserve-3d]"
                  >
                    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
                      <span className="absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/10 blur-2xl transition group-hover:scale-125" />
                    </span>
                    <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-900/40 [transform:translateZ(50px)]">
                      <Icon className="size-5 text-white" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold text-white [transform:translateZ(35px)]">
                      {p.label}
                      <ArrowUpRight className="size-4 text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400 [transform:translateZ(20px)]">{p.description}</p>
                  </Link>
                </Tilt3D>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
