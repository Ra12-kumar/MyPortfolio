import { z } from 'zod';

const optionalString = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() !== '' ? v.trim() : undefined));

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  TRUST_PROXY: z.coerce.number().int().min(0).default(1),

  // Comma-separated list of allowed browser origins.
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  SUPABASE_URL: optionalString,
  SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  STORAGE_BUCKET: z.string().default('project-images'),

  // Without Supabase, inquiries are appended to this file (relative to /server). Set INQUIRY_FILE_STORE=off to disable.
  INQUIRY_STORE_PATH: z.string().default('data/inquiries.jsonl'),
  INQUIRY_FILE_STORE: z.enum(['on', 'off']).default('on'),

  // Any OpenAI-compatible chat completions provider.
  LLM_API_KEY: optionalString,
  LLM_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  LLM_MODEL: z.string().default('gpt-4o-mini'),
  LLM_MAX_TOKENS: z.coerce.number().int().min(50).max(2000).default(400),
  LLM_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(20000),
  CHAT_EXTRA_INSTRUCTIONS: optionalString,

  // Optional e-mail notifications via Resend (https://resend.com).
  RESEND_API_KEY: optionalString,
  NOTIFY_EMAIL_TO: optionalString,
  NOTIFY_EMAIL_FROM: optionalString,
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const config = {
  ...env,
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  corsOrigins: env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  supabaseEnabled: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  // Local file storage for inquiries when Supabase is absent (off under test so the "not configured" path stays testable).
  fileInquiryStoreEnabled:
    env.INQUIRY_FILE_STORE === 'on' && env.NODE_ENV !== 'test' && !(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  authEnabled: Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY && env.SUPABASE_SERVICE_ROLE_KEY),
  llmEnabled: Boolean(env.LLM_API_KEY),
  emailEnabled: Boolean(env.RESEND_API_KEY && env.NOTIFY_EMAIL_TO && env.NOTIFY_EMAIL_FROM),
};
