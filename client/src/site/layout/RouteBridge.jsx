import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInquiry } from '@/context/InquiryContext';
import { pages, routeForSection } from '../routes';

/**
 * Connects the existing (unchanged) one-page components to the router:
 *
 *  1. Existing CTAs call `openInquiry()`, which updates the inquiry context.
 *     When that happens on a page without the form, navigate to /contact.
 *  2. Existing in-page links (href="#projects", footer links, …) change the
 *     URL hash. If the target section isn't on the current page, navigate
 *     to the page that contains it.
 */
export function RouteBridge() {
  const { prefill } = useInquiry();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const lastPrefill = useRef(prefill);

  useEffect(() => {
    if (!prefill || prefill === lastPrefill.current) return;
    lastPrefill.current = prefill;
    if (pathname !== '/contact') navigate('/contact', { state: { scrollTo: 'contact-form', focusForm: true } });
  }, [prefill, pathname, navigate]);

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const target = routeForSection[id];
    if (target && target !== pathname) {
      // The page's primary section sits at the top, so just start there.
      const primary = pages.find((p) => p.path === target)?.sections[0];
      navigate(target, { replace: true, state: { scrollTo: id === primary ? null : id } });
    }
  }, [hash, pathname, navigate]);

  return null;
}

/** Called once the outgoing page has finished its exit animation. */
export function restoreScroll(state) {
  const id = state?.scrollTo;
  const el = id ? document.getElementById(id) : null;
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (state?.focusForm) {
    window.setTimeout(() => document.getElementById('inquiry-fullName')?.focus({ preventScroll: true }), 650);
  }
}
