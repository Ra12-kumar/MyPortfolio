import { motion, useReducedMotion } from 'framer-motion';

/** Subtle fade-up on first scroll into view. Respects reduced-motion. */
export function Reveal({ children, delay = 0, y = 16, className, as = 'div' }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </Comp>
  );
}
