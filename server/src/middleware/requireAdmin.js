import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

/**
 * Verifies the Supabase access token (Authorization: Bearer <jwt>) and checks
 * that the user's profile has role = 'admin'. Attaches req.user on success.
 */
export async function requireAdmin(req, _res, next) {
  try {
    const header = req.get('authorization') || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) throw AppError.unauthorized();

    if (!supabaseAdmin) throw AppError.unavailable('Admin features require Supabase configuration', 'SUPABASE_NOT_CONFIGURED');

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) throw AppError.unauthorized('Session expired or invalid. Please sign in again.');

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile || profile.role !== 'admin') throw AppError.forbidden();

    req.user = { id: data.user.id, email: data.user.email, fullName: profile.full_name, role: profile.role };
    next();
  } catch (err) {
    next(err);
  }
}
