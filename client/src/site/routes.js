/**
 * Multi-page route map. Order defines the "Previous / Next" page navigation.
 * `sections` lists the element ids rendered on that page; it lets legacy
 * in-page links like href="#projects" (used by existing components) be
 * redirected to the right page.
 */
export const pages = [
  {
    path: '/',
    label: 'Home',
    title: 'Ram Jatan Kumar Sah — Full-Stack & AI Solutions Developer',
    description:
      'Software engineer building full-stack web applications, business management systems, AI chatbots and automation that reduce manual work.',
    sections: ['home'],
    shape: 'icosahedron',
  },
  {
    path: '/about',
    label: 'About',
    title: 'About Ram Jatan Kumar Sah — Full-Stack Software Engineer',
    description:
      'Full-stack software engineer with 4 years of experience who understands the business first, then builds web apps and AI solutions that deliver value.',
    eyebrow: 'About me',
    heading: 'Your technology partner, from idea to deployment.',
    sections: ['about', 'tech-skills', 'ai-expertise'],
    shape: 'dodecahedron',
  },
  {
    path: '/services',
    label: 'Services',
    title: 'Services — Websites, Web Apps, AI Chatbots & Automation',
    description:
      'Custom websites, full-stack web applications, business management systems, AI chatbots, API integrations and process automation for growing businesses.',
    eyebrow: 'Services',
    heading: 'Solutions shaped around how your business works.',
    sections: ['services', 'ai'],
    shape: 'torusKnot',
  },
  {
    path: '/projects',
    label: 'Projects',
    title: 'Projects — Gym, Consultancy & Wholesale Business Systems',
    description:
      'Business management systems and e-commerce solutions built around real operational requirements: gym, consultancy and general/wholesale shop projects.',
    eyebrow: 'Projects',
    heading: 'Real business problems. Working solutions.',
    sections: ['projects'],
    shape: 'octahedron',
  },
  {
    path: '/process',
    label: 'Process',
    title: 'Development Process — From Discovery to Deployment',
    description:
      'A clear seven-step process: discovery, requirements, architecture, UI/UX design, development, testing and deployment, then ongoing support and improvements.',
    eyebrow: 'Process',
    heading: 'Seven clear steps from idea to launch.',
    sections: ['process'],
    shape: 'torus',
  },
  {
    path: '/testimonials',
    label: 'Testimonials',
    title: 'Client Feedback & Proof of Work — Ram Jatan Kumar Sah',
    description:
      'Verified client feedback and the real business requirements behind each project, presented honestly with no invented reviews or statistics.',
    eyebrow: 'Proof of work',
    heading: 'Built around real business requirements.',
    sections: ['testimonials'],
    shape: 'dodecahedron',
  },
  {
    path: '/contact',
    label: 'Contact',
    title: "Contact — Discuss Your Project | Ram Jatan Kumar Sah",
    description:
      'Tell me about your website, web app, AI chatbot or automation idea. Free initial consultation via the inquiry form, WhatsApp or email.',
    eyebrow: 'Contact',
    heading: "Have an idea? Let's build something powerful.",
    sections: ['contact', 'contact-form', 'faq'],
    shape: 'icosahedron',
  },
];

/** Maps a legacy in-page anchor id to the page that contains it. */
export const routeForSection = Object.fromEntries(pages.flatMap((p) => p.sections.map((id) => [id, p.path])));

export const pageFor = (pathname) => pages.find((p) => p.path === pathname) || null;

export function neighbours(pathname) {
  const i = pages.findIndex((p) => p.path === pathname);
  if (i === -1) return { prev: null, next: null };
  return { prev: pages[i - 1] || null, next: pages[i + 1] || null };
}
