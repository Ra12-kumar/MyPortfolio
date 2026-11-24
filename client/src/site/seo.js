/**
 * Single source of truth for per-page SEO. Used at BUILD time (vite.config.js writes
 * route-specific HTML so crawlers that don't run JavaScript still see correct tags)
 * and at RUN time (usePageMeta keeps tags in sync during client-side navigation).
 *
 * Dependency-free on purpose (relative imports only, no import.meta.env, no DOM).
 * Only facts that already exist in shared/content.js or the owner's public contact
 * details are used — nothing is invented.
 */
import { pages } from './routes.js';
import { faqs, processSteps, profile, projects, services, skills } from '../shared/content.js';

export const OG_IMAGE_PATH = '/og-image.png';
export const OG_IMAGE_ALT = 'Ram Jatan Kumar Sah — Turning business challenges into powerful digital solutions';
export const ROBOTS_INDEX = 'index, follow, max-image-preview:large';

const PAGE_TYPE = { '/about': 'AboutPage', '/contact': 'ContactPage', '/services': 'CollectionPage', '/projects': 'CollectionPage' };

const knowsAbout = [...new Set(skills.flatMap((g) => g.items.filter((i) => !i.learning).map((i) => i.name)))];

const itemList = (name, items) => ({
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, description: item.description })),
});

/** All SEO data for one page. `base` is the absolute site origin (no trailing slash) or ''. */
export function pageSeo(page, { base = '', contact = {} } = {}) {
  const url = (path) => `${base}${path === '/' ? '/' : path}`;
  const personId = `${base}/#person`;
  const websiteId = `${base}/#website`;
  const canonical = base ? url(page.path) : '';

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    jobTitle: 'Software Engineer & AI Solutions Developer',
    description: profile.introduction,
    url: url('/'),
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    knowsAbout,
  };

  const website = { '@type': 'WebSite', '@id': websiteId, url: url('/'), name: profile.name, inLanguage: 'en', publisher: { '@id': personId } };

  const serviceBusiness = {
    '@type': 'ProfessionalService',
    '@id': `${base}/#service`,
    name: `${profile.name} — Software Development Services`,
    url: url('/'),
    description: pages[0].description,
    provider: { '@id': personId },
    serviceType: services.map((s) => s.title),
    ...(contact.email || contact.phone
      ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', ...(contact.email ? { email: contact.email } : {}), ...(contact.phone ? { telephone: contact.phone } : {}) } }
      : {}),
  };

  const webPage = {
    '@type': PAGE_TYPE[page.path] || 'WebPage',
    '@id': `${canonical || page.path}#webpage`,
    url: canonical || page.path,
    name: page.title,
    description: page.description,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    about: { '@id': personId },
  };

  const graph = [website, person, webPage];

  if (page.path === '/' || page.path === '/contact' || page.path === '/services') graph.push(serviceBusiness);

  if (page.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: url('/') },
        { '@type': 'ListItem', position: 2, name: page.label, item: canonical || page.path },
      ],
    });
  }

  if (page.path === '/services') graph.push(itemList('Services', services.map((s) => ({ name: s.title, description: s.description }))));
  if (page.path === '/projects') graph.push(itemList('Projects', projects.map((p) => ({ name: p.title, description: p.summary }))));
  if (page.path === '/process') graph.push(itemList('Development process', processSteps.map((s) => ({ name: s.title, description: s.description }))));

  if (page.path === '/contact') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    });
  }

  return {
    title: page.title,
    description: page.description,
    canonical,
    image: base ? `${base}${OG_IMAGE_PATH}` : '',
    imageAlt: OG_IMAGE_ALT,
    robots: ROBOTS_INDEX,
    jsonLd: [{ '@context': 'https://schema.org', '@graph': graph }],
  };
}

const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serialises JSON for an inline <script>: `<` is escaped so the data can never close the tag. */
export const safeJson = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Head markup (between the seo:start / seo:end markers) for a page. */
export function headHtml(seo) {
  const lines = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${esc(seo.robots)}" />`,
    seo.canonical && `<link rel="canonical" href="${esc(seo.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(profile.name)}" />`,
    `<meta property="og:locale" content="en" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    seo.canonical && `<meta property="og:url" content="${esc(seo.canonical)}" />`,
    seo.image && `<meta property="og:image" content="${esc(seo.image)}" />`,
    seo.image && `<meta property="og:image:width" content="1200" />`,
    seo.image && `<meta property="og:image:height" content="630" />`,
    seo.image && `<meta property="og:image:alt" content="${esc(seo.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    seo.image && `<meta name="twitter:image" content="${esc(seo.image)}" />`,
    seo.image && `<meta name="twitter:image:alt" content="${esc(seo.imageAlt)}" />`,
    ...seo.jsonLd.map((d) => `<script type="application/ld+json" data-seo>${safeJson(d)}</script>`),
  ];
  return lines.filter(Boolean).join('\n    ');
}
