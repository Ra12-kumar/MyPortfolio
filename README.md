# RJK Portfolio — Software Engineer & AI Solutions

Portfolio website for **Ram Jatan Kumar Sah**. It is a **static, frontend-only** app: there is no backend server and no database.

```
client/   React 19 + Vite + Tailwind v4 + Framer Motion + Three.js   (→ Vercel)
```

## How it works without a backend

| Feature | How it works |
|---|---|
| Portfolio content | Bundled with the site in `client/src/shared/content.js` |
| Project inquiry form | Validated in the browser, then (a) POSTed to an optional hosted form service (`VITE_FORM_ENDPOINT`, e.g. Formspree / Web3Forms) that e-mails you, or (b) handed to the visitor as a prefilled WhatsApp / e-mail message |
| AI assistant | Runs **in the browser** (`client/src/lib/rag/`): BM25 retrieval over an approved knowledge base, answers only from it, hands over to Ram otherwise. No AI provider, API key or server |
| Contact buttons | WhatsApp / e-mail / phone links built from public env values |

> Because everything ships to the browser, **never put a secret in the client code or in a `VITE_*` variable.** Form-service endpoints and access keys (Web3Forms) are public by design.

## Run locally

```bash
cd client
cp .env.example .env.local   # then fill in your public contact details
npm install
npm run dev                  # http://localhost:5173
npm test                     # unit + component tests
npm run build                # production build → client/dist
```

## Environment variables (`client/.env.local`, all public)

All are optional: contact details fall back to the defaults in `client/src/config/site.js`, and on Vercel the site URL falls back to the project's production domain (`VERCEL_PROJECT_PRODUCTION_URL`) for canonical/OG tags and the sitemap.


| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Public site URL — canonical/OG tags, sitemap.xml, robots.txt |
| `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE`, `VITE_WHATSAPP_NUMBER` | Contact details (empty = hidden) |
| `VITE_LINKEDIN_URL`, `VITE_GITHUB_URL`, `VITE_LOCATION` | Optional profile details |
| `VITE_AVAILABILITY_STATUS` | Hero availability badge (leave empty unless confirmed) |
| `VITE_FORM_ENDPOINT`, `VITE_FORM_ACCESS_KEY` | Optional hosted form service so inquiries are e-mailed to you |

## Deploy on Vercel

1. Import the GitHub repo in Vercel and set **Root Directory** to `client` (Framework: Vite; build `npm run build`; output `dist`).
2. Add the environment variables above in **Project → Settings → Environment Variables**.
3. Deploy. `client/vercel.json` provides the SPA rewrite, caching and security headers (CSP, HSTS, frame/referrer/permissions policies).

### Receiving inquiries by e-mail (recommended)
Create a free form on [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com), set `VITE_FORM_ENDPOINT` (and `VITE_FORM_ACCESS_KEY` for Web3Forms). The CSP in `vercel.json` already allows both. For another provider, add its origin to `connect-src`.

## SEO
- Per-page title, description, canonical, Open Graph, Twitter tags and JSON-LD come from `client/src/site/routes.js` + `client/src/site/seo.js`.
- At build time `vite.config.js` writes route-specific HTML (`about/index.html`, …) so crawlers and link-preview bots see correct tags without running JavaScript, plus `404.html` (noindex) so unknown URLs return a real 404, `sitemap.xml` and `robots.txt`.
- To change a page's SEO text, edit `routes.js` and redeploy; keep titles ≤ 60 and descriptions ≤ 160 characters.
- Google Search Console file: `client/public/google5d45381b009d8800.html`.

## Security notes
- The Content-Security-Policy only allows scripts from the site itself and connections to the form services listed above.
- Every URL rendered into a link or image must be `https://` (`client/src/lib/safeUrl.js`); env-provided contact values are format-checked.
- The in-browser assistant refuses requests for secrets and prompt extraction and never claims anything outside the knowledge base.
- Client-side spam protection (hidden honeypot, minimum fill time) is best-effort only: a static site cannot enforce rate limits. Use your form provider's spam protection / CAPTCHA for stronger protection.
- `npm audit` currently reports one issue in `zod` 3.x (large-input memory use). It can only affect a visitor's own browser; fixing it requires the breaking zod 4 upgrade.

## Editing content
Update `client/src/shared/content.js` (services, projects, FAQs, process, pricing options) and the chatbot's knowledge in `client/src/lib/rag/knowledge.js`, then redeploy.
