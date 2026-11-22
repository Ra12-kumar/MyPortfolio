import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertTriangle, Send, Mail } from 'lucide-react';
import { inquiryOptions } from '@shared/content.js';
import { inquiryDefaults, inquirySchema } from '@/lib/inquirySchema';
import { api, apiConfigured } from '@/lib/api';
import { site, whatsappLink } from '@/config/site';
import { useInquiry } from '@/context/InquiryContext';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';

const SUBMITTED_KEY = 'rjk-inquiry-submitted';

function Field({ id, label, error, required, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-rose-300" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function InquiryForm() {
  const { prefill } = useInquiry();
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState({ state: 'idle' }); // idle | success | error
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(inquirySchema), defaultValues: inquiryDefaults, mode: 'onTouched' });

  useEffect(() => {
    if (prefill?.projectType) setValue('projectType', prefill.projectType, { shouldValidate: false });
  }, [prefill, setValue]);

  const description = watch('description') || '';

  const aria = (name) => ({
    id: `inquiry-${name}`,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `inquiry-${name}-error` : undefined,
  });

  const onSubmit = async (values) => {
    setStatus({ state: 'idle' });

    // Client-side duplicate guard (server also de-duplicates for 24h).
    const fingerprint = `${values.email}|${values.description}`.toLowerCase();
    try {
      if (sessionStorage.getItem(SUBMITTED_KEY) === fingerprint) {
        setStatus({ state: 'success', message: 'This inquiry was already sent. I will get back to you soon.' });
        return;
      }
    } catch {
      /* storage unavailable */
    }

    try {
      const res = await api('/inquiries', {
        method: 'POST',
        body: { ...values, source: 'website', formStartedAt: startedAt.current },
        raw: true,
      });
      try {
        sessionStorage.setItem(SUBMITTED_KEY, fingerprint);
      } catch {
        /* ignore */
      }
      reset(inquiryDefaults);
      setStatus({ state: 'success', message: res?.message });
    } catch (err) {
      if (err.code === 'DUPLICATE_INQUIRY') {
        setStatus({ state: 'success', message: err.message });
        return;
      }
      setStatus({ state: 'error', message: err.message || 'Something went wrong. Please try again.' });
    }
  };

  const wa = whatsappLink();

  if (status.state === 'success') {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/30">
          <CheckCircle2 className="size-7 text-emerald-300" aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-xl font-semibold text-white">Inquiry received</h3>
        <p className="mt-3 max-w-md leading-relaxed text-slate-400">
          {status.message || 'Thank you! Your inquiry has been received. I will review it and get back to you soon.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {wa && (
            <Button as="a" href={wa} target="_blank" rel="noopener noreferrer" variant="secondary">
              <WhatsAppIcon className="size-4" /> Continue on WhatsApp
            </Button>
          )}
          <Button variant="ghost" onClick={() => setStatus({ state: 'idle' })}>
            Send another inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 sm:p-8" aria-label="Project inquiry form">
      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="inquiry-website">Website</label>
        <input id="inquiry-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="inquiry-fullName" label="Full name" required error={errors.fullName}>
          <input className="field" autoComplete="name" {...aria('fullName')} {...register('fullName')} />
        </Field>
        <Field id="inquiry-email" label="Business email" required error={errors.email}>
          <input className="field" type="email" autoComplete="email" {...aria('email')} {...register('email')} />
        </Field>
        <Field id="inquiry-phone" label="Phone number" error={errors.phone}>
          <input className="field" type="tel" autoComplete="tel" placeholder="Include country code" {...aria('phone')} {...register('phone')} />
        </Field>
        <Field id="inquiry-company" label="Company / business name" error={errors.company}>
          <input className="field" autoComplete="organization" {...aria('company')} {...register('company')} />
        </Field>
        <Field id="inquiry-businessType" label="Business type" error={errors.businessType}>
          <input className="field" placeholder="e.g. Gym, consultancy, wholesale" {...aria('businessType')} {...register('businessType')} />
        </Field>
        <Field id="inquiry-projectType" label="Project type" required error={errors.projectType}>
          <select className="field" {...aria('projectType')} {...register('projectType')}>
            <option value="" disabled>Select a project type</option>
            {inquiryOptions.projectTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field id="inquiry-description" label="Project description" required error={errors.description}>
            <textarea
              rows={5}
              className="field resize-y"
              placeholder="What problem are you trying to solve? How do you handle it today?"
              maxLength={5000}
              {...aria('description')}
              {...register('description')}
            />
          </Field>
          <p className="mt-1 text-right text-xs text-slate-600" aria-hidden="true">{description.length}/5000</p>
        </div>

        <div className="sm:col-span-2">
          <Field id="inquiry-requiredFeatures" label="Required features" error={errors.requiredFeatures} hint="Optional — list any must-have features.">
            <textarea rows={3} className="field resize-y" maxLength={3000} {...aria('requiredFeatures')} {...register('requiredFeatures')} />
          </Field>
        </div>

        <Field id="inquiry-budget" label="Approximate budget" error={errors.budget}>
          <select className="field" {...aria('budget')} {...register('budget')}>
            <option value="">Prefer not to say</option>
            {inquiryOptions.budgets.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </Field>
        <Field id="inquiry-timeline" label="Expected timeline" error={errors.timeline}>
          <select className="field" {...aria('timeline')} {...register('timeline')}>
            <option value="">Not decided</option>
            {inquiryOptions.timelines.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="field-label">Preferred contact method</legend>
          <div className="flex flex-wrap gap-2">
            {inquiryOptions.contactMethods.map((m) => (
              <label
                key={m}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition has-[:checked]:border-brand-400/60 has-[:checked]:bg-brand-500/10 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-400"
              >
                <input type="radio" value={m} className="sr-only" {...register('preferredContact')} />
                {m}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {status.state === 'error' && (
        <div className="mt-6 flex gap-3 rounded-xl border border-rose-400/30 bg-rose-400/[0.06] p-4" role="alert">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-300" aria-hidden="true" />
          <div className="text-sm">
            <p className="text-rose-200">{status.message}</p>
            {(site.contact.email || wa) && (
              <p className="mt-1 text-slate-400">
                You can also reach me directly
                {site.contact.email && (
                  <>
                    {' '}by <a className="text-white underline" href={`mailto:${site.contact.email}`}>email</a>
                  </>
                )}
                {wa && (
                  <>
                    {site.contact.email ? ' or ' : ' on '}
                    <a className="text-white underline" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </>
                )}
                .
              </p>
            )}
          </div>
        </div>
      )}

      {!apiConfigured && (
        <p className="mt-6 flex items-center gap-2 text-xs text-amber-200/80">
          <Mail className="size-3.5" aria-hidden="true" /> The inquiry service is not connected in this build.
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Your details are used only to respond to your inquiry.</p>
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
          {!isSubmitting && <Send className="size-4" aria-hidden="true" />}
          {isSubmitting ? 'Sending…' : 'Send Inquiry'}
        </Button>
      </div>
    </form>
  );
}
