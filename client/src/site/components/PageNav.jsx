import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { neighbours } from '../routes';
import { Tilt3D } from '../three/Tilt3D';

/** "Previous / Next page" navigation shown at the bottom of every page. */
export function PageNav() {
  const { pathname } = useLocation();
  const { prev, next } = neighbours(pathname);
  if (!prev && !next) return null;

  return (
    <nav aria-label="Page navigation" className="border-t border-white/[0.05] py-14">
      <div className="container-page grid gap-4 sm:grid-cols-2">
        {prev ? <PagerCard page={prev} direction="prev" /> : <span className="hidden sm:block" />}
        {next && <PagerCard page={next} direction="next" />}
      </div>
    </nav>
  );
}

function PagerCard({ page, direction }) {
  const isNext = direction === 'next';
  return (
    <Tilt3D max={6} className={isNext ? 'sm:col-start-2' : ''}>
      <Link
        to={page.path}
        rel={isNext ? 'next' : 'prev'}
        className="card group flex h-full items-center gap-4 p-6 transition hover:border-brand-400/30 [transform-style:preserve-3d]"
      >
        {!isNext && <ArrowLeft className="size-5 text-slate-500 transition group-hover:-translate-x-1 group-hover:text-white" aria-hidden="true" />}
        <div className={`flex-1 [transform:translateZ(30px)] ${isNext ? 'text-right' : ''}`}>
          <p className="text-xs tracking-wide text-slate-500 uppercase">{isNext ? 'Next page' : 'Previous page'}</p>
          <p className="mt-1 text-lg font-semibold text-white">{page.label}</p>
        </div>
        {isNext && <ArrowRight className="size-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />}
      </Link>
    </Tilt3D>
  );
}
