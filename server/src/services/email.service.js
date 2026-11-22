import { config } from '../config/env.js';
import { logger } from '../config/logger.js';
import { escapeHtml } from '../utils/sanitize.js';

/**
 * Sends a new-inquiry notification through Resend if configured.
 * Failures are logged but never fail the inquiry submission itself.
 */
export async function notifyNewInquiry(inquiry) {
  if (!config.emailEnabled) return { sent: false, reason: 'not_configured' };

  const rows = [
    ['Name', inquiry.fullName],
    ['Email', inquiry.email],
    ['Phone', inquiry.phone],
    ['Company', inquiry.company],
    ['Business type', inquiry.businessType],
    ['Project type', inquiry.projectType],
    ['Budget', inquiry.budget],
    ['Timeline', inquiry.timeline],
    ['Preferred contact', inquiry.preferredContact],
    ['Required features', inquiry.requiredFeatures],
    ['Description', inquiry.description],
  ].filter(([, v]) => v);

  const html = `<h2>New project inquiry</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')}</table>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: config.NOTIFY_EMAIL_FROM,
        to: config.NOTIFY_EMAIL_TO.split(',').map((s) => s.trim()),
        reply_to: inquiry.email,
        subject: `New inquiry: ${inquiry.projectType} — ${inquiry.fullName}`,
        html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, 'Inquiry e-mail notification failed');
      return { sent: false, reason: 'provider_error' };
    }
    return { sent: true };
  } catch (err) {
    logger.warn({ err: err.message }, 'Inquiry e-mail notification error');
    return { sent: false, reason: 'network_error' };
  }
}
