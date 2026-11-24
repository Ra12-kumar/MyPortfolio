import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { applyMeta } from '@/site/usePageMeta';

export default function NotFound() {
  // Unknown URLs must never be indexed.
  useEffect(() => {
    applyMeta({ title: 'Page not found — Ram Jatan Kumar Sah', description: "The page you are looking for doesn't exist or has moved.", robots: 'noindex, nofollow', canonical: '', image: '', jsonLd: [] });
  }, []);

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="text-center">
        <p className="font-mono text-sm text-brand-400">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-slate-400">The page you are looking for doesn&apos;t exist or has moved.</p>
        <Button as={Link} to="/" className="mt-8">Back to home</Button>
      </div>
    </main>
  );
}
