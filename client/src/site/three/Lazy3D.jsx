import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

const Scene3D = lazy(() => import('./Scene3D'));

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

/**
 * Loads the three.js scene only when it scrolls near the viewport, pauses
 * rendering while off-screen, and falls back to a pure-CSS 3D orb when
 * WebGL is unavailable or the visitor prefers reduced motion.
 */
export function Lazy3D({ className, ...sceneProps }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl] = useState(() => typeof window !== 'undefined' && supportsWebGL());

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fallback = <CssOrb animate={!reduce} />;

  return (
    <div ref={ref} className={cn('relative', className)}>
      {webgl && !reduce && near ? (
        <Suspense fallback={fallback}>
          <Scene3D active={visible} {...sceneProps} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

/** CSS-only 3D orb with rotating rings (no WebGL required). */
export function CssOrb({ animate = true }) {
  return (
    <div className="absolute inset-0 grid place-items-center [perspective:900px]" aria-hidden="true">
      <div className={cn('relative size-48 [transform-style:preserve-3d] sm:size-56', animate && 'animate-[spin3d_18s_linear_infinite]')}>
        <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#a9bcff,#5b7cfa_40%,#2a1f6b_75%)] shadow-[0_0_80px_-10px_rgba(91,124,250,0.8)]" />
        {[0, 60, 120].map((deg) => (
          <div
            key={deg}
            className="absolute inset-0 rounded-full border border-brand-300/40"
            style={{ transform: `rotateY(${deg}deg) rotateX(72deg)` }}
          />
        ))}
      </div>
      <style>{`@keyframes spin3d{from{transform:rotateX(12deg) rotateY(0)}to{transform:rotateX(12deg) rotateY(360deg)}}`}</style>
    </div>
  );
}
