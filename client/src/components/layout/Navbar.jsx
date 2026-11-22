import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navItems } from '@/config/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useInquiry } from '@/context/InquiryContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const ids = navItems.map((n) => n.id);

export function Logo({ className }) {
  return (
    <a href="#home" className={cn('group flex items-center gap-2.5', className)} aria-label="Ram Jatan Kumar Sah — home">
      <span className="relative grid size-9 place-items-center rounded-xl bg-ink-800 text-[13px] font-bold tracking-tight text-white ring-1 ring-white/10">
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/30 to-accent-500/20 opacity-70 transition group-hover:opacity-100" />
        <span className="relative">RJK</span>
      </span>
      <span className="hidden text-sm leading-tight font-semibold text-white sm:block">
        Ram Jatan Kumar Sah
        <span className="block text-xs font-normal text-slate-400">Full-Stack & AI Solutions</span>
      </span>
    </a>
  );
}

export function Navbar() {
  const active = useActiveSection(ids);
  const { openInquiry } = useInquiry();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-sm transition-colors',
                  active === item.id ? 'text-white' : 'text-slate-400 hover:text-white',
                )}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/[0.07]"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" className="hidden sm:inline-flex" onClick={() => openInquiry()}>
            Let&apos;s Talk
          </Button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl text-slate-200 hover:bg-white/5 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-white/[0.06] lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-base',
                      active === item.id ? 'bg-white/[0.06] text-white' : 'text-slate-300 hover:bg-white/[0.04]',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    openInquiry();
                  }}
                >
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
