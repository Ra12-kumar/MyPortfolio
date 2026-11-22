import { Mail, Phone } from 'lucide-react';
import { profile } from '@shared/content.js';
import { navItems, site, whatsappLink } from '@/config/site';
import { useContent } from '@/hooks/useContent';
import { LinkedInIcon, GitHubIcon, WhatsAppIcon } from '@/components/ui/BrandIcons';
import { Logo } from './Navbar';

export function SocialLinks({ className = '' }) {
  const wa = whatsappLink();
  const links = [
    site.contact.linkedin && { href: site.contact.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    site.contact.github && { href: site.contact.github, label: 'GitHub', Icon: GitHubIcon },
    site.contact.email && { href: `mailto:${site.contact.email}`, label: 'Email', Icon: Mail },
    wa && { href: wa, label: 'WhatsApp', Icon: WhatsAppIcon },
  ].filter(Boolean);

  if (!links.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-10 place-items-center rounded-xl border border-white/10 text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const { data: services } = useContent('services');
  const { data: projects } = useContent('projects');
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{profile.introduction}</p>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">{profile.roles.join(' · ')}</p>
          <SocialLinks className="mt-6" />
        </div>

        <FooterCol title="Navigation" className="lg:col-span-2">
          {navItems.map((n) => (
            <FooterLink key={n.id} href={`#${n.id}`}>{n.label}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Services" className="lg:col-span-3">
          {services.slice(0, 7).map((s) => (
            <FooterLink key={s.slug} href="#services">{s.title}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Projects & Contact" className="lg:col-span-3">
          {projects.map((p) => (
            <FooterLink key={p.slug} href="#projects">{p.title}</FooterLink>
          ))}
          {site.contact.email && (
            <li className="pt-3">
              <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                <Mail className="size-4" aria-hidden="true" /> {site.contact.email}
              </a>
            </li>
          )}
          {site.contact.phone && (
            <li>
              <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                <Phone className="size-4" aria-hidden="true" /> {site.contact.phone}
              </a>
            </li>
          )}
        </FooterCol>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <p>Project previews marked “Illustrative” are design mockups, not client screenshots.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <a href={href} className="text-sm text-slate-400 transition hover:text-white">
        {children}
      </a>
    </li>
  );
}
