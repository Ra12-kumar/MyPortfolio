import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { hero, profile } from '@shared/content.js';
import { site } from '@/config/site';
import { useInquiry } from '@/context/InquiryContext';
import { Button } from '@/components/ui/Button';
import { DeveloperWorkspace3D } from '@/components/three/DeveloperWorkspace3D';

export function Hero() {
  const { openInquiry } = useInquiry();
  const reduce = useReducedMotion();
  const fade = (delay) =>
    reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: 'easeOut' } };

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600/20 via-accent-500/15 to-brand-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid grid-cols-[minmax(0,1fr)] items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
        <div className="min-w-0">
          {site.availability && (
            <motion.p {...fade(0)} className="eyebrow mb-6">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              {site.availability}
            </motion.p>
          )}

          <motion.p {...fade(0.05)} className="mb-4 text-sm font-medium text-slate-400">
            {profile.name} · <span className="text-slate-300">Software Engineer & AI Solutions Developer</span>
          </motion.p>

          <motion.h1
            {...fade(0.1)}
            id="hero-title"
            className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-[3.6rem]"
          >
            Turning Business Challenges Into <span className="text-gradient">Powerful Digital Solutions.</span>
          </motion.h1>

          <motion.p {...fade(0.2)} className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-slate-400 sm:text-lg">
            {hero.description}
          </motion.p>

          <motion.ul {...fade(0.3)} className="mt-8 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2">
            {hero.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 ring-1 ring-brand-400/30">
                  <Check className="size-3 text-brand-300" aria-hidden="true" />
                </span>
                {h}
              </li>
            ))}
          </motion.ul>

          <motion.div {...fade(0.4)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => openInquiry()}>
              Start Your Project <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button as={Link} to="/projects" size="lg" variant="secondary">
              Explore My Work
            </Button>
          </motion.div>

          <motion.p {...fade(0.5)} className="mt-6 text-sm text-slate-500">
            {profile.marketingMessage}
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="min-w-0 lg:pl-6"
        >
          <DeveloperWorkspace3D />
        </motion.div>
      </div>
    </section>
  );
}
