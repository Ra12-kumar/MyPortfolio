import { useState } from 'react';
import { MousePointerClick } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { TechnologyOrbit3D } from '@/components/three/TechnologyOrbit3D';
import { technologies, techCategories } from '@/components/three/techMeta';
import { cn } from '@/lib/cn';

export function TechSkills() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = technologies.find((t) => t.id === selectedId);
  const selectedCategory = selected && techCategories.find((c) => c.id === selected.category)?.label;

  return (
    <section id="tech-skills" aria-labelledby="tech-skills-title" className="section overflow-hidden border-t border-white/[0.05]">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-3xl" aria-hidden="true" />
      <div className="container-page relative">
        <SectionHeading
          id="tech-skills-title"
          eyebrow="Technical skills"
          title="A Full-Stack Toolkit, Built Around Your Product."
          description="From the interface your customers see to the database and AI behind it — the technologies I use to ship complete, production-ready software."
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal className="flex justify-center">
            <TechnologyOrbit3D selectedId={selectedId} onSelect={setSelectedId} />
          </Reveal>

          <div>
            {/* live details panel: text lives in the DOM, not in the canvas */}
            <div className="glass min-h-[132px] rounded-2xl p-5 sm:p-6" aria-live="polite">
              {selected ? (
                <>
                  <p className="text-xs font-semibold tracking-wide text-brand-300 uppercase">{selectedCategory}</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{selected.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{selected.description}</p>
                </>
              ) : (
                <p className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
                  <MousePointerClick className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
                  Tap or click a technology in the orbit — or pick one below — to see how I use it.
                </p>
              )}
            </div>

            <div className="mt-6 space-y-4">
              {techCategories.map((cat) => (
                <div key={cat.id}>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">{cat.label}</p>
                  <ul className="flex flex-wrap gap-2">
                    {technologies
                      .filter((t) => t.category === cat.id)
                      .map((t) => (
                        <li key={t.id}>
                          <button
                            type="button"
                            aria-pressed={selectedId === t.id}
                            onClick={() => setSelectedId(selectedId === t.id ? null : t.id)}
                            className={cn(
                              'rounded-lg border px-3 py-1.5 text-sm transition',
                              selectedId === t.id
                                ? 'border-brand-400/70 bg-brand-500/15 text-white'
                                : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white',
                            )}
                          >
                            {t.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
