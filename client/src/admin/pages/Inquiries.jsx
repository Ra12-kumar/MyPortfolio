import { useEffect, useState } from 'react';
import { AlertTriangle, Inbox, Loader2, Mail, Phone, Search, Trash2, X } from 'lucide-react';
import { useAuth } from '../auth';
import { useAdminQuery } from '../useAdminQuery';
import { PageHeader, StateMessage } from '../AdminLayout';
import { statusLabels, statusTones } from '../statuses';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const PAGE_SIZE = 20;
const fmt = (d) => new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function Inquiries() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const qs = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
  if (status) qs.set('status', status);
  if (debounced) qs.set('search', debounced);
  const { data, loading, error, reload, setData } = useAdminQuery(`/inquiries?${qs}`);

  const onUpdated = (updated) => {
    setData((d) => d && { ...d, items: d.items.map((i) => (i.id === updated.id ? updated : i)) });
    setSelected(updated);
  };
  const onDeleted = (id) => {
    setSelected(null);
    setData((d) => d && { ...d, items: d.items.filter((i) => i.id !== id), total: d.total - 1 });
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <>
      <PageHeader title="Inquiries" description="Project inquiries submitted through the website. Private — admins only." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <label htmlFor="inq-search" className="sr-only">Search inquiries</label>
          <input id="inq-search" className="field pl-9" placeholder="Search name, email or company" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <label htmlFor="inq-status" className="sr-only">Filter by status</label>
        <select
          id="inq-status"
          className="field sm:w-48"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {Object.entries(statusLabels).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {loading && !data && <StateMessage icon={Loader2} title="Loading inquiries…" />}
      {error && (
        <StateMessage icon={AlertTriangle} title="Could not load inquiries" tone="error">
          {error} <button type="button" className="underline" onClick={reload}>Retry</button>
        </StateMessage>
      )}
      {data && data.items.length === 0 && (
        <StateMessage icon={Inbox} title="No inquiries found">
          {status || debounced ? 'Try a different filter.' : 'New inquiries from the contact form will appear here.'}
        </StateMessage>
      )}

      {data && data.items.length > 0 && (
        <div className={cn('card overflow-hidden', loading && 'opacity-60')}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/[0.06] text-xs text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Project type</th>
                  <th className="px-4 py-3 font-medium">Budget</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {data.items.map((inq) => (
                  <tr key={inq.id} className="cursor-pointer hover:bg-white/[0.03]" onClick={() => setSelected(inq)}>
                    <td className="px-4 py-3">
                      <button type="button" className="text-left" onClick={() => setSelected(inq)}>
                        <span className="block font-medium text-white">{inq.fullName}</span>
                        <span className="block text-xs text-slate-500">{inq.company || inq.email}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{inq.projectType}</td>
                    <td className="px-4 py-3 text-slate-400">{inq.budget || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs', statusTones[inq.status])}>{statusLabels[inq.status]}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400">{fmt(inq.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3 text-xs text-slate-400">
            <span>{data.total} total</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span>Page {page} / {totalPages}</span>
              <Button size="sm" variant="ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </div>
      )}

      {selected && <InquiryDrawer inquiry={selected} onClose={() => setSelected(null)} onUpdated={onUpdated} onDeleted={onDeleted} />}
    </>
  );
}

function InquiryDrawer({ inquiry, onClose, onUpdated, onDeleted }) {
  const { request } = useAuth();
  const [status, setStatus] = useState(inquiry.status);
  const [notes, setNotes] = useState(inquiry.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus(inquiry.status);
    setNotes(inquiry.adminNotes || '');
  }, [inquiry]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const dirty = status !== inquiry.status || notes !== (inquiry.adminNotes || '');

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await request(`/inquiries/${inquiry.id}`, { method: 'PATCH', body: { status, adminNotes: notes } });
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Permanently delete this inquiry? This cannot be undone.')) return;
    setSaving(true);
    try {
      await request(`/inquiries/${inquiry.id}`, { method: 'DELETE' });
      onDeleted(inquiry.id);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const rows = [
    ['Phone', inquiry.phone],
    ['Company', inquiry.company],
    ['Business type', inquiry.businessType],
    ['Project type', inquiry.projectType],
    ['Budget', inquiry.budget],
    ['Timeline', inquiry.timeline],
    ['Preferred contact', inquiry.preferredContact],
    ['Source', inquiry.source],
    ['Received', fmt(inquiry.createdAt)],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose} role="presentation">
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="inq-title"
        className="flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/10 bg-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-6">
          <div className="min-w-0">
            <h2 id="inq-title" className="text-lg font-semibold text-white">{inquiry.fullName}</h2>
            <a href={`mailto:${inquiry.email}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand-300 hover:underline">
              <Mail className="size-3.5" aria-hidden="true" /> {inquiry.email}
            </a>
            {inquiry.phone && (
              <a href={`tel:${inquiry.phone}`} className="mt-1 ml-4 inline-flex items-center gap-1.5 text-sm text-brand-300 hover:underline">
                <Phone className="size-3.5" aria-hidden="true" /> {inquiry.phone}
              </a>
            )}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 p-6">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="text-slate-200">{v || '—'}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="text-xs text-slate-500">Project description</h3>
            <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-200">{inquiry.description}</p>
          </div>
          {inquiry.requiredFeatures && (
            <div>
              <h3 className="text-xs text-slate-500">Required features</h3>
              <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-200">{inquiry.requiredFeatures}</p>
            </div>
          )}

          <div className="space-y-4 rounded-xl border border-white/[0.06] p-4">
            <div>
              <label htmlFor="inq-edit-status" className="field-label">Status</label>
              <select id="inq-edit-status" className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
                {Object.entries(statusLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="inq-edit-notes" className="field-label">Internal notes</label>
              <textarea id="inq-edit-notes" rows={4} maxLength={5000} className="field" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            {error && <p className="text-sm text-rose-300" role="alert">{error}</p>}
            <div className="flex justify-between gap-2">
              <Button variant="ghost" size="sm" onClick={remove} disabled={saving} className="text-rose-300 hover:text-rose-200">
                <Trash2 className="size-4" aria-hidden="true" /> Delete
              </Button>
              <Button size="sm" onClick={save} loading={saving} disabled={!dirty}>Save changes</Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
