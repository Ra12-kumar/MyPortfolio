import { Link } from 'react-router-dom';
import { AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { useAdminQuery } from '../useAdminQuery';
import { PageHeader, StateMessage } from '../AdminLayout';
import { statusLabels, statusTones } from '../statuses';
import { cn } from '@/lib/cn';

export default function Overview() {
  const { data, loading, error, reload } = useAdminQuery('/inquiries/analytics');

  return (
    <>
      <PageHeader title="Overview" description="Inquiry pipeline at a glance." />
      {loading && <StateMessage icon={Loader2} title="Loading analytics…" />}
      {error && (
        <StateMessage icon={AlertTriangle} title="Could not load analytics" tone="error">
          {error}{' '}
          <button type="button" className="underline" onClick={reload}>Retry</button>
        </StateMessage>
      )}
      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Total inquiries" value={data.total} />
            <Kpi label="Last 30 days" value={data.last30Days} />
            <Kpi label="New (unhandled)" value={data.byStatus.new} highlight={data.byStatus.new > 0} />
            <Kpi label="Conversion rate" value={data.conversionRate === null ? '—' : `${data.conversionRate}%`} hint="converted ÷ (converted + rejected)" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-white">By status</h2>
              <ul className="mt-5 space-y-3">
                {Object.entries(data.byStatus).map(([status, count]) => (
                  <li key={status}>
                    <div className="flex items-center justify-between text-sm">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs', statusTones[status])}>{statusLabels[status]}</span>
                      <span className="tabular-nums text-slate-300">{count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${data.total ? (count / data.total) * 100 : 0}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-white">By project type</h2>
              {Object.keys(data.byProjectType).length === 0 ? (
                <p className="mt-5 text-sm text-slate-500">No inquiries yet.</p>
              ) : (
                <ul className="mt-5 space-y-3">
                  {Object.entries(data.byProjectType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <li key={type} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{type}</span>
                        <span className="tabular-nums text-slate-400">{count}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          <Link to="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm text-brand-300 hover:text-white">
            Manage inquiries <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}

function Kpi({ label, value, hint, highlight }) {
  return (
    <div className={cn('card p-5', highlight && 'border-brand-400/30')}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-white">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}
