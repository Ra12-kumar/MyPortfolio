import { Mail, Phone, MapPin, Clock3 } from 'lucide-react';
import { site, whatsappLink } from '@/config/site';
import { Reveal } from '@/components/ui/Reveal';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { SocialLinks } from '@/components/layout/Footer';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';

export function Contact() {
  const wa = whatsappLink();
  const details = [
    site.contact.email && { icon: Mail, label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` },
    site.contact.phone && { icon: Phone, label: 'Phone', value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, '')}` },
    wa && { icon: WhatsAppIcon, label: 'WhatsApp', value: 'Chat on WhatsApp', href: wa, external: true },
    site.availability && { icon: Clock3, label: 'Availability', value: site.availability },
    site.location && { icon: MapPin, label: 'Location', value: site.location },
  ].filter(Boolean);

  return (
    <section id="contact" aria-labelledby="contact-title" className="section overflow-hidden border-t border-white/[0.05]">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-3xl" aria-hidden="true" />
      <div className="container-page relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="mt-5 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Have a Project in Mind? Let&apos;s Talk!
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            Looking for a reliable software developer to bring your ideas to life? Whether you need a professional website, a
            full-stack web application, an AI-powered chatbot, or business automation, I&apos;m here to help.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Let&apos;s discuss your requirements and turn your ideas into reality.
          </p>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wider text-slate-300">Working together</h3>
          <ol className="mt-5 space-y-5">
            {[
              ['Share your project requirements', 'Fill in the form or message me directly on WhatsApp or email.'],
              ['Discuss ideas and expectations', 'We talk through goals, workflow and must-have features.'],
              ['Get a solution and timeline', 'You receive a suitable solution with a clear project timeline.'],
              ['Build and launch', "Let's build and launch your project!"],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 font-mono text-xs text-slate-300">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-white">{t}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{d}</p>
                </div>
              </li>
            ))}
          </ol>

          {details.length > 0 && (
            <ul className="mt-10 space-y-3">
              {details.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-3 text-slate-300 hover:text-white"
                    >
                      <span className="grid size-10 place-items-center rounded-xl border border-white/10 group-hover:border-white/20">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm">
                        <span className="block text-xs text-slate-500">{label}</span>
                        {value}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-300">
                      <span className="grid size-10 place-items-center rounded-xl border border-white/10">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm">
                        <span className="block text-xs text-slate-500">{label}</span>
                        {value}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          <SocialLinks className="mt-8" />

          <p className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="size-4" aria-hidden="true" /> I personally review every inquiry. Let&apos;s build something amazing together!
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div id="contact-form" className="card relative scroll-mt-24 shadow-2xl shadow-black/30">
            <div className="border-b border-white/[0.06] px-6 py-5 sm:px-8">
              <h3 className="font-semibold text-white">Project inquiry</h3>
              <p className="mt-1 text-sm text-slate-400">Fields marked * are required. It takes about 2 minutes.</p>
            </div>
            <InquiryForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
