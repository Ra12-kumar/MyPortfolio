import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, Pencil, Plus, Trash2, Upload, X, FolderKanban, Check } from 'lucide-react';
import { useAuth } from '../auth';
import { useAdminQuery } from '../useAdminQuery';
import { PageHeader, StateMessage } from '../AdminLayout';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);

export default function ContentManager({ resource, config }) {
  const { request } = useAuth();
  const { data, loading, error, reload } = useAdminQuery(`/${resource}`);
  const [editing, setEditing] = useState(null); // null | {} (new) | item

  const remove = async (item) => {
    const label = item.title || item.question || item.clientName;
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await request(`/${resource}/${item.id}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <Button size="sm" onClick={() => setEditing({ ...config.defaults })}>
            <Plus className="size-4" aria-hidden="true" /> Add new
          </Button>
        }
      />

      {loading && !data && <StateMessage icon={Loader2} title="Loading…" />}
      {error && (
        <StateMessage icon={AlertTriangle} title="Could not load content" tone="error">
          {error} <button type="button" className="underline" onClick={reload}>Retry</button>
        </StateMessage>
      )}
      {data && data.length === 0 && (
        <StateMessage icon={FolderKanban} title={`No ${config.title.toLowerCase()} yet`}>
          Use “Add new” to create the first one.
        </StateMessage>
      )}
      {data && data.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-xs text-slate-400">
              <tr>
                {config.columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
                ))}
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {data.map((item) => (
                <tr key={item.id}>
                  {config.columns.map((c) => (
                    <td key={c.key} className="max-w-xs truncate px-4 py-3 text-slate-200">
                      {typeof item[c.key] === 'boolean' ? (item[c.key] ? 'Yes' : 'No') : item[c.key] || '—'}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs', item.isPublished ? 'bg-emerald-400/15 text-emerald-200' : 'bg-white/[0.06] text-slate-400')}>
                      {item.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-400">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => setEditing(item)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Edit">
                        <Pencil className="size-4" />
                      </button>
                      <button type="button" onClick={() => remove(item)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-400/10 hover:text-rose-300" aria-label="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditorModal
          resource={resource}
          config={config}
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </>
  );
}

function EditorModal({ resource, config, item, onClose, onSaved }) {
  const { request } = useAuth();
  const isNew = !item.id;
  const [values, setValues] = useState(() => {
    const v = { ...item };
    for (const f of config.fields) if (f.type === 'list') v[f.name] = (item[f.name] || []).join('\n');
    return v;
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const upload = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('Image must be 5 MB or smaller');
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { url } = await request('/uploads', { method: 'POST', body: fd, timeout: 60000 });
      set('imageUrl', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const body = {};
    for (const f of config.fields) {
      let v = values[f.name];
      if (f.type === 'list') v = String(v || '').split('\n').map((s) => s.trim()).filter(Boolean);
      else if (f.type === 'number') v = v === '' || v === null || v === undefined ? (f.nullable ? null : 0) : Number(v);
      else if (f.type === 'checkbox') v = Boolean(v);
      else if (typeof v === 'string') v = v.trim();
      if ((f.type === 'url' || f.type === 'image') && !v) v = null;
      body[f.name] = v ?? (f.type === 'text' || f.type === 'textarea' ? '' : null);
    }

    try {
      await request(isNew ? `/${resource}` : `/${resource}/${item.id}`, { method: isNew ? 'POST' : 'PUT', body });
      onSaved();
    } catch (err) {
      setError(err.message);
      if (err.details) setFieldErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8" role="presentation" onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-2xl bg-ink-900"
        noValidate
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 id="editor-title" className="font-semibold text-white">
            {isNew ? 'Add' : 'Edit'} {config.title.replace(/s$/, '').toLowerCase()}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-5 p-6">
          {config.fields.map((f) => {
            const id = `f-${f.name}`;
            const err = fieldErrors[f.name];
            const common = { id, 'aria-invalid': err ? 'true' : 'false' };

            if (f.type === 'checkbox') {
              return (
                <label key={f.name} htmlFor={id} className="flex items-center gap-3 text-sm text-slate-200">
                  <input {...common} type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => set(f.name, e.target.checked)} className="size-4 accent-brand-500" />
                  {f.label}
                  {err && <span className="field-error mt-0">{err}</span>}
                </label>
              );
            }

            return (
              <div key={f.name}>
                <label htmlFor={id} className="field-label">
                  {f.label} {f.required && <span className="text-rose-300">*</span>}
                </label>
                {f.type === 'textarea' && (
                  <textarea {...common} rows={4} className="field" value={values[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} />
                )}
                {f.type === 'list' && (
                  <textarea {...common} rows={4} className="field font-mono text-xs" placeholder="One item per line" value={values[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} />
                )}
                {(f.type === 'text' || f.type === 'url') && (
                  <input
                    {...common}
                    type={f.type === 'url' ? 'url' : 'text'}
                    className="field"
                    placeholder={f.type === 'url' ? 'https://…' : undefined}
                    value={values[f.name] || ''}
                    onChange={(e) => set(f.name, e.target.value)}
                    onBlur={
                      f.name === 'title' || f.name === 'question'
                        ? () => !values.slug && values[f.name] && set('slug', slugify(values[f.name]))
                        : undefined
                    }
                  />
                )}
                {f.type === 'number' && (
                  <input {...common} type="number" min={0} className="field" value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />
                )}
                {f.type === 'select' && (
                  <select {...common} className="field" value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)}>
                    {f.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                )}
                {f.type === 'image' && (
                  <div className="space-y-3">
                    {values.imageUrl && (
                      <div className="relative overflow-hidden rounded-xl border border-white/10">
                        <img src={values.imageUrl} alt="Project screenshot preview" className="max-h-56 w-full object-cover object-top" />
                        <button
                          type="button"
                          onClick={() => set('imageUrl', null)}
                          className="absolute top-2 right-2 rounded-lg bg-black/70 p-1.5 text-white"
                          aria-label="Remove image"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    )}
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-4 text-sm text-slate-300 hover:border-brand-400/50">
                      {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                      {uploading ? 'Uploading…' : 'Upload PNG, JPEG, WebP or AVIF (max 5 MB)'}
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" disabled={uploading} onChange={(e) => upload(e.target.files?.[0])} />
                    </label>
                  </div>
                )}
                {f.hint && !err && <p className="mt-1.5 text-xs text-slate-500">{f.hint}</p>}
                {err && <p className="field-error">{err}</p>}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="mx-6 mb-4 rounded-lg bg-rose-400/10 p-3 text-sm text-rose-200" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-white/[0.06] px-6 py-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving} disabled={uploading}>
            {!saving && <Check className="size-4" aria-hidden="true" />} Save
          </Button>
        </div>
      </form>
    </div>
  );
}
