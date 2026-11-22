import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const variants = {
  primary:
    'bg-white text-ink-900 hover:bg-slate-100 shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_8px_24px_-8px_rgba(91,124,250,0.55)]',
  brand:
    'bg-gradient-to-b from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500 shadow-[0_8px_24px_-8px_rgba(67,97,238,0.7)]',
  secondary: 'border border-white/12 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/[0.06]',
  danger: 'bg-rose-500/90 text-white hover:bg-rose-500',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
};

const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

export const Button = forwardRef(function Button(
  { as: Comp = 'button', variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref,
) {
  const isButton = Comp === 'button';
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium whitespace-nowrap transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...(isButton ? { type: props.type || 'button', disabled: disabled || loading } : {})}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </Comp>
  );
});
