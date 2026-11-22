import { Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { cn } from '@/lib/cn';
import { detectQuality, supportsWebGL } from './webgl';

/**
 * Hosts a lazily-loaded three.js scene.
 *
 *  - the scene chunk is only requested once the frame is near the viewport;
 *  - `active` flips to false off-screen so the scene stops rendering;
 *  - WebGL-less devices and visitors who prefer reduced motion get `fallback`
 *    (no three.js is downloaded for them);
 *  - the frame has a fixed size (`className`) so nothing shifts when the scene mounts.
 */
export function Scene3DFrame({ Scene, fallback, className, fallbackClassName, label, sceneProps }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [webgl] = useState(supportsWebGL);
  const [quality] = useState(detectQuality);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  const possible = webgl && !reduce;

  useEffect(() => {
    const el = ref.current;
    if (!possible || !el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: '250px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [possible]);

  if (!possible) {
    return <div className={fallbackClassName}>{fallback}</div>;
  }

  return (
    <div ref={ref} className={cn('relative', className)} role="img" aria-label={label}>
      <ErrorBoundary fallback={fallback}>
        {near ? (
          <Suspense fallback={<SceneSkeleton />}>
            <Scene active={visible} quality={quality} {...sceneProps} />
          </Suspense>
        ) : (
          <SceneSkeleton />
        )}
      </ErrorBoundary>
    </div>
  );
}

export function SceneSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <div className="size-1/2 animate-pulse rounded-full bg-gradient-to-br from-brand-600/20 to-accent-500/10 blur-2xl" />
    </div>
  );
}
