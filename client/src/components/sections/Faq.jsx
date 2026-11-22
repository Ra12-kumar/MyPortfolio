import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';

export function Faq() {
  const { data: faqs } = useContent('faqs');
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-paper-50">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          id="faq-title"
          eyebrow="FAQ"
          title="Frequently asked questions."
          description="Straight answers. If your question isn't here, ask the AI assistant or send an inquiry."
          align="left"
          tone="light"
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="divide-y divide-paper-200 rounded-3xl border border-paper-200 bg-white px-5 shadow-sm sm:px-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const btnId = `${baseId}-q-${i}`;
            const panelId = `${baseId}-a-${i}`;
            return (
              <div key={f.slug || f.id || i}>
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium text-ink-900 hover:text-brand-600 sm:text-base"
                  >
                    {f.question}
                    <Plus
                      className={cn('size-5 shrink-0 text-slate-400 transition-transform duration-300', isOpen && 'rotate-45 text-brand-600')}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-[15px] leading-relaxed text-slate-600">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
