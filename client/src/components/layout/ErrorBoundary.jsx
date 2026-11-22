import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Hook point for an error-reporting service (e.g. Sentry).
    console.error('UI error:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <div role="alert" className="flex min-h-[50vh] items-center justify-center px-4 py-20">
        <div className="card max-w-md p-8 text-center">
          <AlertTriangle className="mx-auto size-8 text-amber-400" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-white">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-400">This part of the page failed to load. Please refresh to try again.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Reload page
          </button>
        </div>
      </div>
    );
  }
}
