import { site, whatsappLink } from '@/config/site';

/**
 * Delivers a project inquiry without any backend of our own.
 *
 *  1. If VITE_FORM_ENDPOINT is set (Formspree / Web3Forms / similar hosted form
 *     service) the inquiry is POSTed there and lands in Ram's inbox.
 *  2. Otherwise — or if that service fails — the visitor is handed a prefilled
 *     WhatsApp / e-mail message so the inquiry still reaches Ram.
 *
 * Nothing secret lives here: form-service endpoints and access keys are public by design.
 */

const LABELS = [
  ['fullName', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['company', 'Company'],
  ['businessType', 'Business type'],
  ['projectType', 'Project type'],
  ['budget', 'Budget'],
  ['timeline', 'Timeline'],
  ['preferredContact', 'Preferred contact'],
  ['requiredFeatures', 'Required features'],
  ['description', 'Project description'],
];

/** Plain-text version of the inquiry (for WhatsApp / e-mail). */
export function buildInquiryMessage(values) {
  const lines = LABELS.filter(([key]) => values[key]).map(([key, label]) => `${label}: ${String(values[key]).trim()}`);
  return `New project inquiry\n\n${lines.join('\n')}`;
}

export function whatsappInquiryLink(values) {
  return whatsappLink(buildInquiryMessage(values));
}

export function mailInquiryLink(values) {
  if (!site.contact.email) return null;
  const subject = encodeURIComponent(`Project inquiry: ${values.projectType} — ${values.fullName}`);
  return `mailto:${site.contact.email}?subject=${subject}&body=${encodeURIComponent(buildInquiryMessage(values))}`;
}

/**
 * Returns { mode: 'sent' } when a form service accepted the inquiry, or
 * { mode: 'handoff' } when the visitor must send it via WhatsApp / e-mail.
 */
export async function deliverInquiry(values, { timeout = 12000 } = {}) {
  if (!site.formEndpoint) return { mode: 'handoff' };

  const payload = {
    ...(site.formAccessKey ? { access_key: site.formAccessKey } : {}),
    subject: `New project inquiry: ${values.projectType} — ${values.fullName}`,
    from_name: values.fullName,
    replyto: values.email,
    ...Object.fromEntries(LABELS.filter(([key]) => values[key]).map(([key, label]) => [label, String(values[key]).trim()])),
  };

  try {
    const res = await fetch(site.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(timeout),
    });
    return res.ok ? { mode: 'sent' } : { mode: 'handoff' };
  } catch {
    return { mode: 'handoff' };
  }
}
