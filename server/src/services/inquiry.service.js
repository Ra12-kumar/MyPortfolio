import crypto from 'node:crypto';
import { supabaseAdmin } from '../config/supabase.js';
import { config } from '../config/env.js';
import { saveInquiry } from './fileInquiryStore.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';
import { inquiryStatuses } from '../../../shared/content.js';
import { notifyNewInquiry } from './email.service.js';

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;
const MIN_FILL_TIME_MS = 3000;

const FIELD_MAP = {
  fullName: 'full_name', email: 'email', phone: 'phone', company: 'company', businessType: 'business_type',
  projectType: 'project_type', description: 'description', requiredFeatures: 'required_features', budget: 'budget',
  timeline: 'timeline', preferredContact: 'preferred_contact', source: 'source', status: 'status', adminNotes: 'admin_notes',
};

function toApi(row) {
  const out = { id: row.id, createdAt: row.created_at, updatedAt: row.updated_at };
  for (const [api, db] of Object.entries(FIELD_MAP)) out[api] = row[db];
  return out;
}

function requireDb() {
  if (!supabaseAdmin) {
    throw AppError.unavailable(
      'The inquiry service is not configured yet. Please reach out by email or WhatsApp instead.',
      'SUPABASE_NOT_CONFIGURED',
    );
  }
  return supabaseAdmin;
}

export function dedupeHash({ email, description }) {
  const normalized = `${email.toLowerCase().trim()}|${description.toLowerCase().replace(/\s+/g, ' ').trim()}`;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/** Spam heuristics. Returns true if the submission looks automated. */
export function looksLikeSpam({ website, formStartedAt, description }, now = Date.now()) {
  if (website && website.trim() !== '') return true; // honeypot filled
  if (formStartedAt && now - formStartedAt < MIN_FILL_TIME_MS) return true; // filled impossibly fast
  const links = (description.match(/https?:\/\//gi) || []).length;
  return links > 3;
}

export async function createInquiry(input) {
  if (looksLikeSpam(input)) {
    // Pretend success so bots get no signal; nothing is stored.
    logger.info('Inquiry dropped by spam filter');
    return { id: null, accepted: true };
  }

  const hash = dedupeHash(input);

  if (config.fileInquiryStoreEnabled) {
    const fields = {};
    for (const api of Object.keys(FIELD_MAP)) {
      if (input[api] !== undefined && api !== 'status' && api !== 'adminNotes') fields[api] = input[api];
    }
    const saved = await saveInquiry(fields, hash, DUPLICATE_WINDOW_MS);
    logger.info({ inquiryId: saved.id }, 'Inquiry saved to local file store');
    notifyNewInquiry(input).catch(() => {});
    return { id: saved.id, accepted: true };
  }

  const db = requireDb();
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();

  const { data: existing, error: dupError } = await db
    .from('inquiries')
    .select('id')
    .eq('dedupe_hash', hash)
    .gte('created_at', since)
    .limit(1);
  if (dupError) throw dupError;
  if (existing.length > 0) {
    throw AppError.conflict('It looks like you already sent this inquiry. I will get back to you soon.', 'DUPLICATE_INQUIRY');
  }

  const record = { dedupe_hash: hash, status: 'new' };
  for (const [api, dbField] of Object.entries(FIELD_MAP)) {
    if (input[api] !== undefined && api !== 'status' && api !== 'adminNotes') record[dbField] = input[api];
  }

  const { data, error } = await db.from('inquiries').insert(record).select('id, created_at').single();
  if (error) throw error;

  // Fire-and-forget: notification failure must not affect the visitor.
  notifyNewInquiry(input).catch(() => {});

  return { id: data.id, accepted: true };
}

export async function listInquiries({ status, search, page, pageSize }) {
  const db = requireDb();
  let query = db.from('inquiries').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  if (search) {
    // Strip PostgREST filter-syntax characters, then quote the pattern.
    const term = search.replace(/[%,()"\\*]/g, ' ').trim();
    if (term) {
      const p = `"%${term}%"`;
      query = query.or(`full_name.ilike.${p},email.ilike.${p},company.ilike.${p}`);
    }
  }
  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);
  if (error) throw error;
  return { items: data.map(toApi), total: count ?? 0, page, pageSize };
}

export async function updateInquiry(id, { status, adminNotes }) {
  const db = requireDb();
  const patch = {};
  if (status !== undefined) patch.status = status;
  if (adminNotes !== undefined) patch.admin_notes = adminNotes;
  const { data, error } = await db.from('inquiries').update(patch).eq('id', id).select('*').maybeSingle();
  if (error) throw error;
  if (!data) throw AppError.notFound('Inquiry not found');
  return toApi(data);
}

export async function deleteInquiry(id) {
  const db = requireDb();
  const { data, error } = await db.from('inquiries').delete().eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw AppError.notFound('Inquiry not found');
}

export async function getAnalytics() {
  const db = requireDb();
  const { data, error } = await db.from('inquiries').select('status, project_type, created_at');
  if (error) throw error;

  const byStatus = Object.fromEntries(inquiryStatuses.map((s) => [s, 0]));
  const byProjectType = {};
  const last30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let recent = 0;

  for (const row of data) {
    byStatus[row.status] = (byStatus[row.status] || 0) + 1;
    byProjectType[row.project_type] = (byProjectType[row.project_type] || 0) + 1;
    if (new Date(row.created_at).getTime() >= last30) recent += 1;
  }

  const decided = byStatus.converted + byStatus.rejected;
  return {
    total: data.length,
    last30Days: recent,
    byStatus,
    byProjectType,
    conversionRate: decided > 0 ? Math.round((byStatus.converted / decided) * 100) : null,
  };
}
