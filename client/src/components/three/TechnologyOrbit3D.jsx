import { lazy } from 'react';
import { Scene3DFrame } from './Scene3DFrame';
import { technologies, techCategories } from './techMeta';

const OrbitScene = lazy(() => import('./OrbitScene'));

/**
 * Interactive 3D technology orbit. Selection is controlled by the parent so the
 * accessible DOM list and the 3D scene always agree. Without WebGL (or with
 * reduced motion) the parent's DOM list is the whole experience, so the
 * fallback here is just a static grouped list of the same technologies.
 */
export function TechnologyOrbit3D({ selectedId, onSelect, className = 'aspect-square w-full max-w-[640px] sm:aspect-[5/4]' }) {
  return (
    <Scene3DFrame
      Scene={OrbitScene}
      sceneProps={{ selectedId, onSelect }}
      fallback={<StaticTechGrid selectedId={selectedId} onSelect={onSelect} />}
      className={className}
      fallbackClassName="w-full max-w-[640px]"
      label="Interactive 3D orbit of technologies: React, HTML5, CSS3, JavaScript, Node.js, Express, Java, REST APIs, PostgreSQL, SQL, RAG, AI APIs and chatbots. A list of the same technologies is provided below."
    />
  );
}

function StaticTechGrid({ selectedId, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {technologies.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(selectedId === t.id ? null : t.id)}
          aria-pressed={selectedId === t.id}
          className="glass rounded-xl px-3 py-3 text-left text-sm text-slate-200 hover:border-white/20 aria-pressed:border-brand-400/60"
        >
          <span className="block text-xs text-slate-500">{techCategories.find((c) => c.id === t.category)?.label}</span>
          {t.name}
        </button>
      ))}
    </div>
  );
}
