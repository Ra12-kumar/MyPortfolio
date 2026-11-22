import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../auth';
import { Button } from '@/components/ui/Button';
import { apiConfigured } from '@/lib/api';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(6, 'Password is too short'),
});

export default function Login() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  if (session) return <Navigate to="/admin" replace />;

  const onSubmit = async ({ email, password }) => {
    setError(null);
    try {
      await login(email, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500">
            <Lock className="size-5 text-white" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-xl font-semibold text-white">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-400">Authorized administrators only.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5 p-6">
          {!apiConfigured && (
            <p className="rounded-lg bg-amber-400/10 p-3 text-xs text-amber-200">VITE_API_URL is not configured — sign in is unavailable.</p>
          )}
          <div>
            <label htmlFor="admin-email" className="field-label">Email</label>
            <input id="admin-email" type="email" autoComplete="username" className="field" aria-invalid={errors.email ? 'true' : 'false'} {...register('email')} />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="admin-password" className="field-label">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" className="field" aria-invalid={errors.password ? 'true' : 'false'} {...register('password')} />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>
          {error && (
            <p className="flex items-start gap-2 rounded-lg bg-rose-400/10 p-3 text-sm text-rose-200" role="alert">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {error}
            </p>
          )}
          <Button type="submit" className="w-full" loading={isSubmitting} disabled={!apiConfigured}>
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
