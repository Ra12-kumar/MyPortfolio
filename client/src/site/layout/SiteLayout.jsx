import { useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { InquiryProvider } from '@/context/InquiryContext';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { RouterNavbar } from './RouterNavbar';
import { RouteBridge, restoreScroll } from './RouteBridge';

/** Thin gradient bar showing reading progress through the current page. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-brand-400 to-accent-400"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

/**
 * Shell for the multi-page site: router-aware navbar, 3D page transitions,
 * and the existing footer + AI chat widget (reused unchanged).
 */
export function SiteLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();
  const stateRef = useRef(location.state);
  stateRef.current = location.state;

  const variants = reduce
    ? { initial: { opacity: 0 }, enter: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, rotateX: -6, y: 60, scale: 0.98 },
        enter: { opacity: 1, rotateX: 0, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, rotateX: 5, y: -30, scale: 0.98, transition: { duration: 0.25, ease: 'easeIn' } },
      };

  return (
    <InquiryProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink-900"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <RouteBridge />
      <RouterNavbar />

      <div className="[perspective:1400px]">
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => restoreScroll(stateRef.current)}>
          <motion.main
            id="main"
            key={location.pathname}
            variants={variants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{ transformOrigin: '50% 0%' }}
          >
            <ErrorBoundary>{outlet}</ErrorBoundary>
          </motion.main>
        </AnimatePresence>
      </div>

      <Footer />
      <ErrorBoundary fallback={null}>
        <ChatWidget />
      </ErrorBoundary>
    </InquiryProvider>
  );
}
