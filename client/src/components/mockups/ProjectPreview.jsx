import { Bell, CalendarCheck, FileText, Search, ShoppingCart, Users, UserCheck, Package, Tag, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Illustrative, code-drawn UI previews used when no real screenshot exists.
 * Always rendered with a visible "Illustrative preview" label.
 */
export function ProjectPreview({ project }) {
  if (project.imageUrl) {
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
        <img
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover object-top"
        />
      </div>
    );
  }

  const Mock = { gym: GymMock, consultancy: ConsultancyMock, shop: ShopMock }[project.previewKey] || GenericMock;
  return (
    <figure className="relative">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2.5">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-2 truncate text-[10px] text-slate-500">{project.title}</span>
        </div>
        <div className="aspect-[16/10] p-3 sm:p-4">
          <Mock />
        </div>
      </div>
      <figcaption className="absolute top-12 right-3 rounded-full border border-white/10 bg-ink-900/90 px-2.5 py-1 text-[10px] font-medium text-slate-300 backdrop-blur">
        Illustrative preview
      </figcaption>
    </figure>
  );
}

const Line = ({ w = 'w-full', className }) => <div className={cn('h-1.5 rounded bg-white/10', w, className)} />;

function Stat({ icon: Icon, tone }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
      <Icon className={cn('size-3.5', tone)} aria-hidden="true" />
      <Line w="w-2/3" className="mt-2" />
      <Line w="w-1/3" className="mt-1.5 bg-white/[0.06]" />
    </div>
  );
}

function GymMock() {
  return (
    <div className="grid h-full grid-cols-[1fr_1.4fr] gap-3" aria-hidden="true">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Stat icon={Users} tone="text-brand-300" />
          <Stat icon={CalendarCheck} tone="text-emerald-300" />
          <Stat icon={Clock} tone="text-amber-300" />
          <Stat icon={Bell} tone="text-accent-400" />
        </div>
        <div className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
          <p className="text-[9px] text-slate-500">Attendance</p>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: 21 }).map((_, i) => (
              <span key={i} className={cn('aspect-square rounded-[3px]', i % 5 === 0 ? 'bg-white/[0.05]' : i % 3 === 0 ? 'bg-brand-400/40' : 'bg-brand-500/70')} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-medium text-slate-300">Members</p>
          <span className="rounded bg-brand-500/20 px-1.5 py-0.5 text-[8px] text-brand-200">+ Add</span>
        </div>
        <div className="mt-2 flex-1 space-y-2">
          {['Active', 'Expiring', 'Active', 'Expired', 'Active'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="size-4 shrink-0 rounded-full bg-slate-600" />
              <Line w="w-full" />
              <span
                className={cn(
                  'shrink-0 rounded px-1.5 py-0.5 text-[8px]',
                  s === 'Active' && 'bg-emerald-400/10 text-emerald-300',
                  s === 'Expiring' && 'bg-amber-400/10 text-amber-300',
                  s === 'Expired' && 'bg-rose-400/10 text-rose-300',
                )}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConsultancyMock() {
  const cols = [
    { name: 'New leads', tone: 'bg-brand-400', n: 3 },
    { name: 'Follow-up', tone: 'bg-amber-400', n: 2 },
    { name: 'Documents', tone: 'bg-accent-400', n: 2 },
    { name: 'Converted', tone: 'bg-emerald-400', n: 1 },
  ];
  return (
    <div className="flex h-full flex-col gap-2.5" aria-hidden="true">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
          <Search className="size-3 text-slate-500" />
          <Line w="w-1/3" />
        </div>
        <span className="flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-1.5 text-[8px] text-slate-400">
          <Bell className="size-3" /> Reminders
        </span>
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        {cols.map((c) => (
          <div key={c.name} className="flex flex-col gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1.5">
            <p className="flex items-center gap-1 text-[8px] text-slate-400">
              <span className={cn('size-1.5 rounded-full', c.tone)} /> {c.name}
            </p>
            {Array.from({ length: c.n }).map((_, i) => (
              <div key={i} className="rounded-md border border-white/[0.06] bg-ink-800 p-1.5">
                <div className="flex items-center gap-1">
                  {c.name === 'Documents' ? <FileText className="size-2.5 text-slate-400" /> : <UserCheck className="size-2.5 text-slate-400" />}
                  <Line w="w-2/3" />
                </div>
                <Line w="w-1/2" className="mt-1.5 bg-white/[0.06]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopMock() {
  return (
    <div className="flex h-full flex-col gap-2.5" aria-hidden="true">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
          <Search className="size-3 text-slate-500" />
          <span className="text-[8px] text-slate-500">Search products…</span>
        </div>
        <span className="relative rounded-md bg-white/[0.04] p-1.5">
          <ShoppingCart className="size-3 text-slate-300" />
        </span>
      </div>
      <div className="flex gap-1.5">
        {['All', 'Groceries', 'Household', 'Wholesale'].map((c, i) => (
          <span key={c} className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px]', i === 0 ? 'bg-brand-500/25 text-brand-100' : 'bg-white/[0.04] text-slate-400')}>
            {i > 0 && <Tag className="size-2.5" />} {c}
          </span>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-lg border border-white/[0.06] bg-white/[0.02] p-1.5">
            <div className="grid flex-1 place-items-center rounded-md bg-gradient-to-br from-ink-700 to-ink-800">
              <Package className="size-4 text-slate-500" />
            </div>
            <Line w="w-3/4" className="mt-1.5" />
            <div className="mt-1 flex items-center justify-between">
              <Line w="w-1/3" className="bg-brand-400/40" />
              <span className="size-3 rounded bg-brand-500/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericMock() {
  return (
    <div className="grid h-full grid-cols-3 gap-2" aria-hidden="true">
      <div className="col-span-3 grid grid-cols-3 gap-2">
        <Stat icon={Users} tone="text-brand-300" />
        <Stat icon={CalendarCheck} tone="text-emerald-300" />
        <Stat icon={Bell} tone="text-accent-400" />
      </div>
      <div className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
        <div className="flex h-full items-end gap-1">
          {[40, 55, 48, 70, 62, 80, 74].map((h, i) => (
            <span key={i} className="flex-1 rounded-t bg-brand-500/60" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
        <Line /> <Line w="w-2/3" /> <Line w="w-3/4" /> <Line w="w-1/2" />
      </div>
    </div>
  );
}
