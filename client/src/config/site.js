/**
 * Site-wide configuration sourced from environment variables.
 * Empty values are treated as "not provided" and hidden from the UI —
 * contact details are never invented.
 */
import { isAllowedApiUrl, isEmail, isPhone, safeHttpsUrl } from '@/lib/safeUrl';

const read = (key) => {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
};

const whatsappNumber = read('VITE_WHATSAPP_NUMBER')?.replace(/[^\d]/g, '') || null;

// Only well-formed values reach the UI: a malformed or malicious env value is
// dropped instead of being rendered into an href.
const rawApiUrl = read('VITE_API_URL')?.replace(/\/$/, '') || null;
const apiUrl = rawApiUrl && isAllowedApiUrl(rawApiUrl, { production: import.meta.env.PROD }) ? rawApiUrl : null;
if (rawApiUrl && !apiUrl && import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.error('VITE_API_URL must be an https:// URL in production; the API is disabled.');
}
const email = read('VITE_CONTACT_EMAIL');
const phone = read('VITE_CONTACT_PHONE');

export const site = {
  apiUrl,
  siteUrl: safeHttpsUrl(read('VITE_SITE_URL')),
  availability: read('VITE_AVAILABILITY_STATUS'),
  location: read('VITE_LOCATION'),
  contact: {
    email: isEmail(email) ? email : null,
    phone: isPhone(phone) ? phone : null,
    whatsapp: whatsappNumber && /^\d{7,15}$/.test(whatsappNumber) ? whatsappNumber : null,
    linkedin: safeHttpsUrl(read('VITE_LINKEDIN_URL')),
    github: safeHttpsUrl(read('VITE_GITHUB_URL')),
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
