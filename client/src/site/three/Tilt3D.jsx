import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Pointer-driven 3D tilt with a moving glare. Children can use
 * `[transform:translateZ(40px)]` to float above the card surface.
 * Disabled for touch input and reduced-motion users.
 */
export function Tilt3D({ children, className, max = 10, glare = true }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const glareBg = useTransform([glareX, glareY], ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.12), transparent 55%)`);

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div className={cn('[perspective:1000px]', className)}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full"
      >
        {children}
        {glare && <motion.div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: glareBg }} aria-hidden="true" />}
      </motion.div>
    </div>
  );
}
