import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Lazy3D } from '../three/Lazy3D';

/** Page banner with breadcrumb, headline and an interactive 3D object. */
export function PageHeader({ page }) {
  const reduce = useReducedMotion();
  const fade = (delay) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: 'easeOut' } };

  return (
    <section className="relative overflow-hidden border-b border-white/[0.05] pt-28 pb-12 sm:pt-32 sm:pb-16" aria-labelledby="page-title">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[620px] rounded-full bg-gradient-to-l from-brand-600/20 via-accent-500/10 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div className="container-page relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <motion.nav {...fade(0)} aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="size-3" /></li>
              <li className="text-slate-300" aria-current="page">{page.label}</li>
            </ol>
          </motion.nav>
          <motion.p {...fade(0.05)} className="mt-6 text-sm font-semibold tracking-wide text-brand-400 uppercase">
            {page.eyebrow}
          </motion.p>
          <motion.h1
            {...fade(0.1)}
            id="page-title"
            className="mt-3 text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-white sm:text-5xl"
          >
            {page.heading}
          </motion.h1>
          <motion.p {...fade(0.2)} className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {page.description}
          </motion.p>
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.85, rotateY: -25 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block"
        >
          <Lazy3D shape={page.shape} className="h-64 lg:h-72" particles={250} distance={7} />
        </motion.div>
      </div>
    </section>
  );
}
