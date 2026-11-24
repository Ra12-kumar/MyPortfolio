import { useEffect } from 'react';
import { site } from '@/config/site';
import { DEFAULTS } from '@/config/contactDefaults';
import { pageSeo, safeJson } from './seo';

function upsert(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

const meta = (name, content) => upsert(`meta[name="${name}"]`, 'meta', { name, content });
const prop = (property, content) => upsert(`meta[property="${property}"]`, 'meta', { property, content });

/** Writes title / description / robots / canonical / Open Graph / Twitter / JSON-LD into <head>. */
export function applyMeta(seo) {
  document.title = seo.title;
  meta('description', seo.description);
  meta('robots', seo.robots);
  prop('og:title', seo.title);
  prop('og:description', seo.description);
  meta('twitter:title', seo.title);
  meta('twitter:description', seo.description);

  if (seo.canonical) {
    upsert('link[rel="canonical"]', 'link', { rel: 'canonical', href: seo.canonical });
    prop('og:url', seo.canonical);
  } else {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    document.head.querySelector('meta[property="og:url"]')?.remove();
  }
  if (seo.image) {
    prop('og:image', seo.image);
    meta('twitter:image', seo.image);
  }

  // Replace structured data left by the previous page.
  document.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove());
  (seo.jsonLd || []).forEach((data) => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-seo', '');
    s.textContent = safeJson(data);
    document.head.appendChild(s);
  });
}

/** Keeps the document head in sync with the current route (the static HTML already carries the same tags). */
export function usePageMeta(page) {
  const path = page?.path;
  useEffect(() => {
    if (!page) return;
    const base = (site.siteUrl || window.location.origin).replace(/\/$/, '');
    applyMeta(pageSeo(page, { base, contact: { email: site.contact.email || DEFAULTS.email, phone: site.contact.phone || DEFAULTS.phone } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
}
