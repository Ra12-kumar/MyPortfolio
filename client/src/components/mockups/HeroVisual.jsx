import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bot, Database, LayoutDashboard, Users, CreditCard, Inbox, Plug, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Inquiries', icon: Inbox },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

// Purely illustrative numbers for the UI mockup (labelled as sample data).
const bars = {
  overview: [38, 52, 44, 63, 58, 72, 66, 80, 74, 88, 82, 94],
  leads: [20, 28, 24, 35, 31, 42, 38, 45, 52, 48, 60, 57],
  members: [55, 58, 61, 60, 66, 69, 71, 74, 73, 78, 81, 84],
  billing: [42, 40, 48, 51, 47, 56, 60, 58, 64, 70, 68, 75],
};

function Float({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn('absolute', className)}
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 + delay, ease: 'easeOut' }}
    >
      <div className={reduce ? '' : 'animate-float'} style={{ animationDelay: `${delay * 2}s` }}>
        {children}
      </div>
    </motion.div>
  );
}

export function HeroVisual() {
  const [tab, setTab] = useState('overview');
  const data = bars[tab];

  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none" aria-label="Illustrative software dashboard preview">
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-gradient-to-tr from-brand-600/20 via-accent-500/10 to-transparent blur-3xl" />

      {/* Main dashboard window */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850/90 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-3 truncate rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-slate-500">app.yourbusiness.com/dashboard</span>
          <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-400">Illustrative</span>
        </div>

        <div className="grid grid-cols-[auto_1fr]">
          <div className="flex flex-col gap-1 border-r border-white/[0.06] p-2 sm:p-3" role="tablist" aria-label="Dashboard views">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-2 text-xs transition sm:px-3',
                  tab === id ? 'bg-white/[0.07] text-white' : 'text-slate-500 hover:text-slate-300',
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="min-w-0 p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {['Active', 'Pending', 'Automated'].map((k, i) => (
                <div key={k} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 sm:p-3">
                  <p className="text-[10px] text-slate-500 sm:text-[11px]">{k}</p>
                  <div className="mt-2 h-2 w-3/4 rounded bg-white/10" />
                  <div className={cn('mt-2 h-1 rounded-full', ['bg-brand-500/70 w-2/3', 'bg-amber-400/60 w-1/3', 'bg-emerald-400/60 w-1/2'][i])} />
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-300">{tabs.find((t) => t.id === tab).label} trend</p>
                <p className="text-[10px] text-slate-500">sample data</p>
              </div>
              <div className="mt-4 flex h-28 items-end gap-1.5 sm:h-32">
                {data.map((h, i) => (
                  <motion.div
                    key={`${tab}-${i}`}
                    className="flex-1 rounded-t-[4px] bg-gradient-to-t from-brand-600/50 to-brand-400/90"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: i * 0.025, ease: 'easeOut' }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-1 py-1">
                  <span className="size-6 shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-700" />
                  <span className="h-2 flex-1 rounded bg-white/[0.07]" />
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px]', ['bg-emerald-400/10 text-emerald-300', 'bg-brand-400/10 text-brand-300', 'bg-amber-400/10 text-amber-300'][i])}>
                    {['Paid', 'New', 'Due'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <Float className="-top-6 -left-4 hidden sm:block lg:-left-10" delay={0.1}>
        <div className="glass w-60 rounded-2xl p-3.5 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500">
              <Bot className="size-4 text-white" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-white">AI Assistant</p>
              <p className="text-[10px] text-slate-400">Answering a customer query</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl rounded-tl-sm bg-white/[0.06] p-2.5 text-[11px] leading-relaxed text-slate-300">
            Your membership renews on the 1st. Would you like a reminder?
          </div>
        </div>
      </Float>

      <Float className="-right-3 top-1/3 hidden sm:block lg:-right-8" delay={0.3}>
        <div className="glass w-52 rounded-2xl p-3.5 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2 text-xs font-medium text-white">
            <Plug className="size-4 text-brand-300" aria-hidden="true" /> API Integration
          </div>
          <div className="mt-2.5 space-y-1.5 font-mono text-[10px]">
            <p className="flex justify-between text-slate-400"><span>POST /payments</span><span className="text-emerald-300">200</span></p>
            <p className="flex justify-between text-slate-400"><span>POST /notify</span><span className="text-emerald-300">202</span></p>
            <p className="flex justify-between text-slate-400"><span>GET /crm/leads</span><span className="text-emerald-300">200</span></p>
          </div>
        </div>
      </Float>

      <Float className="-bottom-8 left-6 hidden sm:block lg:left-10" delay={0.5}>
        <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl shadow-black/40">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-400/10">
            <Database className="size-4 text-emerald-300" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-medium text-white">PostgreSQL connected</p>
            <p className="flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck className="size-3" aria-hidden="true" /> Row-level security on
            </p>
          </div>
          <Sparkles className="ml-2 size-4 text-accent-400" aria-hidden="true" />
        </div>
      </Float>
    </div>
  );
}
