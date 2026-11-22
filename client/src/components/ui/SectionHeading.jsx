import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

export function SectionHeading({ eyebrow, title, description, align = 'center', tone = 'dark', className, id }) {
  const light = tone === 'light';
  return (
    <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className={cn('mb-4 text-sm font-semibold tracking-wide uppercase', light ? 'text-brand-600' : 'text-brand-400')}>
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          'text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]',
          light ? 'text-ink-900' : 'text-white',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('mt-5 text-base leading-relaxed text-pretty sm:text-lg', light ? 'text-slate-600' : 'text-slate-400')}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
