import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const InquiryContext = createContext(null);

/**
 * Lets any CTA on the page "open" the project inquiry form: it scrolls to
 * the contact section and pre-selects the relevant project type.
 */
export function InquiryProvider({ children }) {
  const [prefill, setPrefill] = useState(null);

  const openInquiry = useCallback((projectType) => {
    setPrefill({ projectType: projectType || undefined, at: Date.now() });
    const el = document.getElementById('contact-form') || document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move focus into the form for keyboard and screen-reader users.
    window.setTimeout(() => document.getElementById('inquiry-fullName')?.focus({ preventScroll: true }), 600);
  }, []);

  const value = useMemo(() => ({ prefill, openInquiry }), [prefill, openInquiry]);
  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error('useInquiry must be used inside InquiryProvider');
  return ctx;
}
