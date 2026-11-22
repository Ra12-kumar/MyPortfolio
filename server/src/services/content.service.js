import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';
import { resources, toApi, toDb } from './resources.js';

function getResource(name) {
  const resource = resources[name];
  if (!resource) throw AppError.notFound('Unknown resource');
  return resource;
}

function requireDb() {
  if (!supabaseAdmin) throw AppError.unavailable('Content management requires Supabase configuration', 'SUPABASE_NOT_CONFIGURED');
  return supabaseAdmin;
}

function mapDbError(error) {
  if (error?.code === '23505') return AppError.conflict('An item with this slug already exists', 'DUPLICATE');
  if (error?.code === '23503') return AppError.badRequest('Referenced item does not exist');
  if (error?.code === '23514') return AppError.badRequest('A field failed database validation');
  return error;
}

/** Published content for public visitors. Falls back to static content without a DB. */
export async function listPublished(name) {
  const resource = getResource(name);
  if (!supabaseAdmin) return resource.fallback();

  const query = resource.publicFilter(supabaseAdmin.from(resource.table).select('*'));
  const { data, error } = await query.order('sort_order', { ascending: true }).order('created_at', { ascending: true });
  if (error) throw error;
  return data.map((row) => toApi(resource, row));
}

export async function listAll(name) {
  const resource = getResource(name);
  const { data, error } = await requireDb()
    .from(resource.table)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data.map((row) => toApi(resource, row));
}

export async function create(name, payload) {
  const resource = getResource(name);
  const { data, error } = await requireDb().from(resource.table).insert(toDb(resource, payload)).select('*').single();
  if (error) throw mapDbError(error);
  return toApi(resource, data);
}

export async function update(name, id, payload) {
  const resource = getResource(name);
  const { data, error } = await requireDb()
    .from(resource.table)
    .update(toDb(resource, payload))
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw AppError.notFound();
  return toApi(resource, data);
}

export async function remove(name, id) {
  const resource = getResource(name);
  const { data, error } = await requireDb().from(resource.table).delete().eq('id', id).select('id').maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw AppError.notFound();
}
