import crypto from 'node:crypto';
import { config } from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/avif': 'avif' };

// Verify the real file type from magic bytes rather than trusting the client.
function sniffMime(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buf.toString('ascii', 4, 12) === 'ftypavif') return 'image/avif';
  return null;
}

export async function uploadProjectImage(file) {
  if (!supabaseAdmin) throw AppError.unavailable('Uploads require Supabase configuration', 'SUPABASE_NOT_CONFIGURED');
  if (!file) throw AppError.badRequest('No file uploaded');

  const mime = sniffMime(file.buffer);
  if (!mime) throw AppError.badRequest('Only PNG, JPEG, WebP or AVIF images are allowed');

  const path = `projects/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${EXT[mime]}`;
  const { error } = await supabaseAdmin.storage
    .from(config.STORAGE_BUCKET)
    .upload(path, file.buffer, { contentType: mime, cacheControl: '31536000', upsert: false });
  if (error) throw error;

  const { data } = supabaseAdmin.storage.from(config.STORAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}
