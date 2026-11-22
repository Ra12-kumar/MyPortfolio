import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { pages } from '../routes';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

/** Route-based navigation bar for the multi-page site. */
export function RouterNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open ? 'border-b border-white/[0.06] bg-ink-900/80 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Primary">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Ram Jatan Kumar Sah — home">
          <span className="relative grid size-9 place-items-center rounded-xl bg-ink-800 text-[13px] font-bold tracking-tight text-white ring-1 ring-white/10 transition duration-500 group-hover:[transform:rotateY(180deg)]">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/30 to-accent-500/20" />
            <span className="relative">RJK</span>
          </span>
          <span className="hidden text-sm leading-tight font-semibold text-white sm:block">
            Ram Jatan Kumar Sah
            <span className="block text-xs font-normal text-slate-400">Full-Stack & AI Solutions</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {pages.map((p) => (
            <li key={p.path}>
              <NavLink
                to={p.path}
                end={p.path === '/'}
                className={({ isActive }) =>
                  cn('relative block rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'text-white' : 'text-slate-400 hover:text-white')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="route-pill"
                        className="absolute inset-0 rounded-lg bg-white/[0.07]"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{p.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button as={Link} to="/contact" size="sm" className="hidden sm:inline-flex">
            Let&apos;s Talk
          </Button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl text-slate-200 hover:bg-white/5 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="route-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="route-mobile-menu"
            initial={{ opacity: 0, rotateX: -15, transformPerspective: 800, originY: 0 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: -10 }}
            transition={{ duration: 0.25 }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/[0.06] lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-4">
              {pages.map((p, i) => (
                <motion.li key={p.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <NavLink
                    to={p.path}
                    end={p.path === '/'}
                    className={({ isActive }) =>
                      cn('block rounded-xl px-4 py-3 text-base', isActive ? 'bg-white/[0.06] text-white' : 'text-slate-300 hover:bg-white/[0.04]')
                    }
                  >
                    {p.label}
                  </NavLink>
                </motion.li>
              ))}
              <li className="pt-2">
                <Button as={Link} to="/contact" className="w-full">
                  Let&apos;s Talk
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
