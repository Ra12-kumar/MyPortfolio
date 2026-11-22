import { Monitor, Server, Database, Bot } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Lazy3D } from '../three/Lazy3D';

const layers = [
  { icon: Monitor, title: 'Frontend', text: 'Fast, responsive interfaces your customers and staff enjoy using.', dot: 'bg-brand-300' },
  { icon: Server, title: 'Backend & APIs', text: 'Business logic, authentication and integrations with your tools.', dot: 'bg-accent-400' },
  { icon: Database, title: 'Database', text: 'Structured, secure data with role-based access.', dot: 'bg-emerald-400' },
  { icon: Bot, title: 'AI layer', text: 'Assistants and automation that take repetitive work off your plate.', dot: 'bg-sky-300' },
];

/** Home-page section: interactive 3D "connected systems" visual. */
export function SystemsShowcase() {
  return (
    <section aria-labelledby="systems-title" className="section overflow-hidden border-t border-white/[0.05]">
      <div className="container-page grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-2 lg:order-1">
          <div className="pointer-events-none absolute inset-8 rounded-full bg-brand-600/15 blur-3xl" aria-hidden="true" />
          <Lazy3D className="h-[340px] sm:h-[440px]" shape="icosahedron" />
          <p className="mt-2 text-center text-xs text-slate-500">Move your cursor over the model to rotate it.</p>
        </Reveal>
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-brand-400 uppercase">One connected system</p>
            <h2 id="systems-title" className="mt-4 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
              Every layer of your software, built to work together.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              Most problems appear where separate tools meet. I design the frontend, backend, database and AI as one system — so
              information flows without manual copying.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {layers.map(({ icon: Icon, title, text, dot }, i) => (
              <Reveal as="li" key={title} delay={i * 0.06}>
                <div className="card h-full p-5">
                  <div className="flex items-center gap-2.5">
                    <span className={`size-2 rounded-full ${dot}`} aria-hidden="true" />
                    <Icon className="size-4 text-slate-300" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
