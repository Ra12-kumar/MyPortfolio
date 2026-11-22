import * as content from '@shared/content.js';

/** Portfolio content is bundled with the site (src/shared/content.js) — there is no backend to fetch from. */
const resources = {
  projects: content.projects,
  services: content.services,
  faqs: content.faqs,
  testimonials: content.testimonials,
};

export function useContent(resource) {
  return { data: resources[resource] ?? [], loading: false, source: 'static' };
}
