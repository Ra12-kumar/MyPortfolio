import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { profile } from '@shared/content.js';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Tilt3D } from '../three/Tilt3D';

/** Closing call-to-action card used on content pages. */
export function CtaBand({ title = "Ready to turn your idea into working software?", text = profile.secondaryMessage }) {
  return (
    <section className="py-16 sm:py-20" aria-label="Start a project">
      <div className="container-page">
        <Reveal>
          <Tilt3D max={4}>
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-brand-600/30 via-ink-800 to-accent-500/20 p-8 sm:p-12 [transform-style:preserve-3d]">
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between [transform:translateZ(40px)]">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">{title}</h2>
                  <p className="mt-3 text-slate-300">{text}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button as={Link} to="/contact" size="lg">
                    Start Your Project <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                  <Button as={Link} to="/projects" size="lg" variant="secondary">
                    View My Projects
                  </Button>
                </div>
              </div>
            </div>
          </Tilt3D>
        </Reveal>
      </div>
    </section>
  );
}
