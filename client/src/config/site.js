/**
 * Site-wide configuration sourced from environment variables.
 * Empty values are treated as "not provided" and hidden from the UI —
 * contact details are never invented.
 */
const read = (key) => {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
};

const whatsappNumber = read('VITE_WHATSAPP_NUMBER')?.replace(/[^\d]/g, '') || null;

export const site = {
  apiUrl: read('VITE_API_URL')?.replace(/\/$/, '') || null,
  siteUrl: read('VITE_SITE_URL'),
  availability: read('VITE_AVAILABILITY_STATUS'),
  location: read('VITE_LOCATION'),
  contact: {
    email: read('VITE_CONTACT_EMAIL'),
    phone: read('VITE_CONTACT_PHONE'),
    whatsapp: whatsappNumber,
    linkedin: read('VITE_LINKEDIN_URL'),
    github: read('VITE_GITHUB_URL'),
  },
};

export function whatsappLink(message = "Hi Ram, I'd like to discuss a project.") {
  if (!site.contact.whatsapp) return null;
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'process', label: 'Process' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];
