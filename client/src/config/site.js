/**
 * Site-wide configuration sourced from environment variables.
 * Empty values are treated as "not provided" and hidden from the UI —
 * contact details are never invented.
 */
import { isEmail, isPhone, safeHttpsUrl } from '@/lib/safeUrl';

const read = (key) => {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
};

// Public contact details of the site owner. They are used when the matching VITE_* variable is not set at build
// time (e.g. a fresh Vercel project), so the live site never ships without a way to reach Ram.
const DEFAULTS = {
  email: 'ramsah01012002@gmail.com',
  phone: '+91 7323891747',
  whatsapp: '917323891747',
  availability: 'Open for Freelance Projects & Collaboration',
};

const whatsappNumber = (read('VITE_WHATSAPP_NUMBER') ?? DEFAULTS.whatsapp).replace(/[^\d]/g, '') || null;

// Only well-formed values reach the UI: a malformed or malicious env value is
// dropped instead of being rendered into an href.
const email = read('VITE_CONTACT_EMAIL') ?? DEFAULTS.email;
const phone = read('VITE_CONTACT_PHONE') ?? DEFAULTS.phone;

export const site = {
  // Optional hosted form service (Formspree, Web3Forms, …). Public by design — never a secret.
  formEndpoint: safeHttpsUrl(read('VITE_FORM_ENDPOINT')),
  formAccessKey: read('VITE_FORM_ACCESS_KEY'),
  siteUrl: safeHttpsUrl(read('VITE_SITE_URL')),
  availability: read('VITE_AVAILABILITY_STATUS') ?? DEFAULTS.availability,
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
