import { useEffect, useState } from 'react';
import * as content from '@shared/content.js';
import { api, apiConfigured } from '@/lib/api';

/**
 * Loads published content from the API, falling back to the bundled static
 * content (shared/content.js) so the site always renders something accurate.
 */
const fallbacks = {
  projects: content.projects,
  services: content.services,
  faqs: content.faqs,
  testimonials: content.testimonials,
};

const cache = new Map();

export function useContent(resource) {
  const [state, setState] = useState(() => ({
    data: cache.get(resource) ?? fallbacks[resource],
    loading: apiConfigured && !cache.has(resource),
    source: cache.has(resource) ? 'api' : 'static',
  }));

  useEffect(() => {
    if (!apiConfigured || cache.has(resource)) return undefined;
    const controller = new AbortController();
    api(`/${resource}`, { signal: controller.signal, timeout: 8000 })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Unexpected response');
        // Keep the static content if the DB has not been seeded yet.
        const usable = data.length > 0 || resource === 'testimonials' ? data : fallbacks[resource];
        cache.set(resource, usable);
        setState({ data: usable, loading: false, source: 'api' });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState((s) => ({ ...s, loading: false, source: 'static' }));
      });
    return () => controller.abort();
  }, [resource]);

  return state;
}
