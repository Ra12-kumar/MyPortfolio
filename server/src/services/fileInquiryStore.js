import { appendFile, mkdir, readFile, stat } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * Local inquiry storage used when Supabase is not configured: one JSON object
 * per line (JSONL) in INQUIRY_STORE_PATH. It keeps inquiries from being lost
 * on a single-server deployment (VPS, Docker volume, local machine).
 *
 * NOTE: hosts with an ephemeral filesystem (Render free tier, Vercel, Heroku)
 * erase this file on every deploy/restart — use Supabase there.
 */

const SERVER_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const storePath = () => path.resolve(SERVER_ROOT, config.INQUIRY_STORE_PATH);

// Serialises writes so concurrent requests never interleave partial lines.
let queue = Promise.resolve();

async function recentHashes(file, sinceMs) {
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return new Set();
    throw err;
  }
  const hashes = new Set();
  for (const line of text.split('\n')) {
    if (!line) continue;
    try {
      const row = JSON.parse(line);
      if (row.dedupeHash && new Date(row.createdAt).getTime() >= sinceMs) hashes.add(row.dedupeHash);
    } catch {
      /* skip a corrupt line */
    }
  }
  return hashes;
}

/** Appends an inquiry. Rejects duplicates seen within `windowMs`. */
export function saveInquiry(fields, dedupeHash, windowMs) {
  const run = async () => {
    const file = storePath();
    await mkdir(path.dirname(file), { recursive: true });

    const size = await stat(file).then((s) => s.size).catch(() => 0);
    if (size > MAX_FILE_BYTES) {
      throw AppError.unavailable('The inquiry service is temporarily unavailable. Please reach out by email or WhatsApp instead.', 'INQUIRY_STORE_FULL');
    }

    if ((await recentHashes(file, Date.now() - windowMs)).has(dedupeHash)) {
      throw AppError.conflict('It looks like you already sent this inquiry. I will get back to you soon.', 'DUPLICATE_INQUIRY');
    }

    const record = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'new', dedupeHash, ...fields };
    await appendFile(file, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
    return record;
  };

  const result = queue.then(run, run);
  queue = result.catch(() => {});
  return result;
}
