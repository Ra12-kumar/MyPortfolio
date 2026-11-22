import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { BarChart3, Inbox, FolderKanban, Layers, MessageSquareQuote, HelpCircle, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from './auth';
import { cn } from '@/lib/cn';

const links = [
  { to: '/admin', label: 'Overview', icon: BarChart3, end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/services', label: 'Services', icon: Layers },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition', isActive ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white')
          }
        >
          <Icon className="size-4" aria-hidden="true" /> {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-ink-950 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-white/[0.06] bg-ink-900 p-4 lg:flex lg:flex-col">
        <Link to="/admin" className="mb-8 flex items-center gap-2 px-2 pt-1 text-sm font-semibold text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-[11px]">RJK</span>
          Admin
        </Link>
        {nav}
        <div className="mt-auto space-y-2 border-t border-white/[0.06] pt-4">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white">
            <ExternalLink className="size-3.5" aria-hidden="true" /> View website
          </a>
          <p className="truncate px-3 text-xs text-slate-500">{user?.email}</p>
          <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white">
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-white/[0.06] bg-ink-900 px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold text-white">RJK Admin</span>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open} className="rounded-lg p-2 text-slate-300 hover:bg-white/5">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-b border-white/[0.06] bg-ink-900 p-4 lg:hidden">
          {nav}
          <button type="button" onClick={logout} className="mt-3 flex items-center gap-2 px-3 py-2 text-sm text-slate-400">
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </button>
        </div>
      )}

      <main className="min-w-0 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function StateMessage({ icon: Icon, title, children, tone = 'neutral' }) {
  return (
    <div className={cn('card flex flex-col items-center px-6 py-14 text-center', tone === 'error' && 'border-rose-400/20')}>
      {Icon && <Icon className={cn('size-7', tone === 'error' ? 'text-rose-300' : 'text-slate-500')} aria-hidden="true" />}
      <p className="mt-4 font-medium text-white">{title}</p>
      {children && <div className="mt-1 max-w-md text-sm text-slate-400">{children}</div>}
    </div>
  );
}
