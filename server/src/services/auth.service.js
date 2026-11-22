import { createAnonClient, supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

export async function loginAdmin({ email, password }) {
  const anon = createAnonClient();
  if (!anon || !supabaseAdmin) {
    throw AppError.unavailable('Admin login requires Supabase configuration', 'SUPABASE_NOT_CONFIGURED');
  }

  const { data, error } = await anon.auth.signInWithPassword({ email, password });
  if (error || !data?.session) throw AppError.unauthorized('Invalid email or password');

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('full_name, role')
    .eq('id', data.user.id)
    .maybeSingle();
  if (profileError) throw profileError;

  if (!profile || profile.role !== 'admin') {
    // Revoke the session we just created for a non-admin account.
    await anon.auth.signOut().catch(() => {});
    throw AppError.forbidden('This account does not have admin access');
  }

  return {
    accessToken: data.session.access_token,
    expiresAt: data.session.expires_at, // unix seconds
    user: { id: data.user.id, email: data.user.email, fullName: profile.full_name, role: profile.role },
  };
}
