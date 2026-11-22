# RJK Portfolio — Software Engineer & AI Solutions

A client-acquisition portfolio for **Ram Jatan Kumar Sah**: a public marketing site, a project inquiry pipeline, an AI assistant (RJK AI Assistant) and a protected admin dashboard.

```
├── client/      React 19 + Vite + Tailwind v4 + Framer Motion  (→ Vercel)
├── server/      Node.js + Express REST API, /api/v1             (→ Render / Railway)
├── shared/      content.js — single source of truth for business content
└── supabase/    SQL migrations (schema, RLS, storage bucket)    (→ Supabase)
```

## Architecture

```
Browser ──► client (static, Vercel)
   │            │ falls back to shared/content.js if the API is unreachable
   ▼            ▼
server /api/v1 (Express)
   ├─ GET  /projects /services /faqs /testimonials   public, published only
   ├─ POST /inquiries   validated · sanitized · rate-limited · honeypot · 24h de-dupe → Supabase (+ optional e-mail)
   ├─ POST /chat        validated · rate-limited · LLM (OpenAI-compatible) → rule-based fallback
   ├─ POST /admin/login Supabase Auth password sign-in + role check
   └─ /admin/*          Bearer JWT → supabase.auth.getUser → profiles.role = 'admin'
                         inquiries (list/filter/update/delete), analytics, CRUD for content, image uploads
Supabase: Postgres + RLS + Auth + Storage (bucket "project-images")
```

Key decisions:

- **Secrets live only on the server.** The service-role key and the LLM key are never bundled into the frontend. `VITE_*` variables are public.
- **Inquiries go through the backend.** RLS gives anonymous users no insert or select on `inquiries`, so rate limits and spam checks can't be bypassed.
- **Defence in depth.** Admin routes check the role in Express, and RLS (`is_admin()`) enforces it again in the database.
- **Honest content.** No fabricated stats, clients or testimonials. Project visuals without real screenshots are code-drawn mockups labelled **"Illustrative preview"**. Demo and GitHub buttons appear only when a real URL is set. Testimonials are public only when `is_verified AND is_published`. Otherwise the section shows *"Built With Real Business Requirements"*.
- **Chat conversations are not stored** (no `chatbot_conversations` table), so no visitor data is kept that isn't needed.

## Prerequisites

- Node.js **22.9+** (the dev scripts use `--env-file-if-exists`)
- A Supabase project (free tier is fine)
- Optional: an OpenAI-compatible API key, a Resend account for e-mail notifications

## Local development

```bash
# 1. Backend
cd server
cp .env.example .env          # fill in values (see below)
npm install
npm run dev                   # http://localhost:4000  (GET /health)

# 2. Frontend (new terminal)
cd client
cp .env.example .env.local
npm install
npm run dev                   # http://localhost:5173
```

**Without Supabase:** the site still renders fully from `shared/content.js`, and the chatbot uses its rule-based fallback. Inquiries are saved to `server/data/inquiries.jsonl` (single-server hosts with a persistent disk only — use Supabase on ephemeral hosts such as Render free tier or Vercel), and admin login is unavailable. Set `INQUIRY_FILE_STORE=off` to disable the file store.

## Environment variables

### `server/.env`

| Variable | Required | Purpose |
|---|---|---|
| `CORS_ORIGINS` | yes | Comma-separated allowed origins, e.g. `https://yourdomain.com` |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | for DB/admin | Supabase → Project Settings → API |
| `STORAGE_BUCKET` | no | Defaults to `project-images` |
| `LLM_API_KEY` | for AI chat | Empty = rule-based fallback |
| `LLM_BASE_URL`, `LLM_MODEL` | no | Any OpenAI-compatible Chat Completions endpoint (default `gpt-4o-mini`) |
| `LLM_MAX_TOKENS`, `LLM_TIMEOUT_MS`, `CHAT_EXTRA_INSTRUCTIONS` | no | Tuning / extra system-prompt rule |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | no | New-inquiry e-mail notifications |
| `TRUST_PROXY` | no | Proxy hops (1 on Render/Railway) for correct per-IP rate limiting |

### `client/.env.local` (all public)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | e.g. `https://your-api.onrender.com/api/v1` |
| `VITE_SITE_URL` | Public URL, used for canonical/OG tags and to generate `sitemap.xml` + `robots.txt` |
| `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE`, `VITE_WHATSAPP_NUMBER` (digits, intl. format), `VITE_LINKEDIN_URL`, `VITE_GITHUB_URL`, `VITE_LOCATION` | Contact details. Empty values are hidden. |
| `VITE_AVAILABILITY_STATUS` | Hero badge text. **Leave empty unless availability is confirmed.** |

## Supabase setup

1. Create a project at supabase.com.
2. Run the migration: open **SQL Editor**, paste `supabase/migrations/20261110000001_init.sql`, and run it. Alternatively, with the Supabase CLI: `supabase link` then `supabase db push`.
3. Seed content from `shared/content.js` (idempotent upsert by slug):
   ```bash
   cd server && npm run seed
   ```
4. **Create the admin user.** In Authentication → Users → *Add user*, set an e-mail and a strong password. Then promote that user in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'YOUR_ADMIN_EMAIL');
   ```
   New users always start as `viewer`, and no API can change a role.
5. Recommended: in Authentication → Providers, **disable public sign-ups**, since only you need an account.

## Admin dashboard

Visit `/admin`. Features:
- **Overview:** totals, last 30 days, status breakdown, conversion rate.
- **Inquiries:** search, filter, update status (New → Contacted → In Discussion → Proposal Sent → Converted / Rejected), internal notes, delete.
- **Projects, Services, FAQs, Testimonials:** add, edit, delete, publish and reorder. Projects support screenshot upload (PNG/JPEG/WebP/AVIF, ≤ 5 MB, type checked by magic bytes).

Sessions are kept in `sessionStorage` and expire with the Supabase access token (about 1 hour). After that, sign in again. Admin pages are `noindex` and disallowed in `robots.txt`.

## AI assistant

- `POST /api/v1/chat` sends the last 12 messages plus a system prompt built **only** from approved content: shared profile data and published services, projects and FAQs from the DB, cached for 5 minutes.
- Guardrails: no invented prices, timelines, clients, reviews or contact details. It identifies itself as an AI, declines off-topic requests, and resists prompt injection. Only `user`/`assistant` roles are accepted.
- Limits: 30 requests per 10 minutes per IP, 1000 characters per message, 24 messages per request, 12 user messages per conversation in the UI.
- If the provider is unconfigured, slow (`LLM_TIMEOUT_MS`) or failing, the bot answers from a rule-based responder using the same approved content.
- The **AI Automation** section has a separate in-browser demo using a *fictional* business, clearly labelled "Demo".

## Editing content

All copy lives in `shared/content.js`: profile, services, projects, process, FAQs and skills. Once the DB is seeded, services, projects, FAQs and testimonials are managed from the admin panel.

- **Skills:** set `learning: true` on any skill still at a learning stage. It is then shown with a dashed "currently learning" style.
- **Projects:** add real `imageUrl`, `demoUrl` and `githubUrl` values via the admin panel when available.

## Tests

```bash
cd server && npm test   # 39 tests: validation, spam/dedupe, chat guardrails & fallback, admin auth guard, CORS/headers
cd client && npm test   # 12 tests: inquiry schema, form submit/validation/error flows, demo assistant
```

## Production deployment

**Database:** Supabase (steps above).

**Backend (Render example)**
1. New → Web Service → connect the repo. Root directory: `server`.
2. Build command `npm ci`, start command `npm start`, health check path `/health`.
3. Add all server env vars. Set `NODE_ENV=production` and `CORS_ORIGINS=https://your-frontend-domain`.

Railway works the same way: root `server`, start `npm start`.

**Frontend (Vercel)**
1. Import the repo and set the root directory to `client`. Framework: Vite.
2. Keep "Include source files outside the Root Directory" enabled, because the client imports `../shared`.
3. Add the `VITE_*` env vars, including `VITE_API_URL` and `VITE_SITE_URL`.
4. `vercel.json` provides SPA rewrites, security headers, immutable asset caching and `noindex` for `/admin`.

**Post-deploy checklist**
- [ ] `GET /health` shows `database: configured` (and `ai: configured` if a key is set)
- [ ] Submit a test inquiry → it appears in the admin panel → delete it
- [ ] The chatbot answers, and the fallback works if the key is removed
- [ ] Admin login works, and a non-admin account is refused
- [ ] Public sign-ups are disabled in Supabase
- [ ] Replace `client/public/og-image.svg` with a 1200×630 **PNG/JPG** (most social networks don't render SVG previews) and update the path in `client/vite.config.js`
