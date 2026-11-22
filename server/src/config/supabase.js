import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

const clientOptions = { auth: { persistSession: false, autoRefreshToken: false } };

/**
 * Service-role client. Bypasses RLS — use ONLY on the server, and only after
 * the request has been validated/authorized. Never send this key to a browser.
 */
export const supabaseAdmin = config.supabaseEnabled
  ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, clientOptions)
  : null;

/** Creates a short-lived anon client (used for password sign-in). */
export function createAnonClient() {
  if (!config.authEnabled) return null;
  return createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, clientOptions);
}
