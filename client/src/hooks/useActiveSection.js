import { useEffect, useState } from 'react';

/** Returns the id of the section currently in view (for nav highlighting). */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length || typeof IntersectionObserver === 'undefined') return undefined;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        const best = ids.filter((id) => (visible.get(id) ?? 0) > 0);
        if (best.length) setActive(best[0]);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.25] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
