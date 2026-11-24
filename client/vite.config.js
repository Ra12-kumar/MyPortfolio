import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { pages } from './src/site/routes.js';
import { DEFAULTS } from './src/config/contactDefaults.js';
import { headHtml, pageSeo } from './src/site/seo.js';

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const wrap = (inner) => `<!--seo:start-->\n    ${inner}\n    <!--seo:end-->`;

/**
 * SEO plugin.
 *  - Writes title / description / robots / canonical / Open Graph / Twitter / JSON-LD into index.html.
 *  - After the build, emits ROUTE-SPECIFIC copies of index.html (about/index.html, services/index.html, …) so
 *    crawlers and link-preview bots that do not run JavaScript still get the correct tags for every page,
 *    plus a 404.html (noindex) so unknown URLs return a real 404 instead of a soft-404.
 *  - Generates robots.txt and sitemap.xml. Nothing is emitted with a placeholder domain: without a site URL
 *    (VITE_SITE_URL, or Vercel's production domain) canonical/absolute URLs and the sitemap are omitted.
 */
function seoPlugin(siteUrl, contact) {
  const base = siteUrl ? siteUrl.replace(/\/$/, '') : '';
  const home = pages[0];
  let outDir = 'dist';
  return {
    name: 'portfolio-seo',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      return html.replace(SEO_BLOCK, wrap(headHtml(pageSeo(home, { base, contact }))));
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', base ? `Sitemap: ${base}/sitemap.xml` : ''].filter(Boolean).join('\n');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` });
      if (base) {
        const today = new Date().toISOString().slice(0, 10);
        const priority = { '/': '1.0', '/services': '0.9', '/contact': '0.9', '/about': '0.8', '/projects': '0.8' };
        const urls = pages
          .map((p) => `  <url><loc>${base}${p.path}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${priority[p.path] || '0.6'}</priority></url>`)
          .join('\n');
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      }
    },
    closeBundle() {
      const indexPath = join(outDir, 'index.html');
      let template;
      try {
        template = readFileSync(indexPath, 'utf8');
      } catch {
        return; // e.g. SSR/library builds
      }
      const emit = (file, html) => {
        const target = join(outDir, file);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, html);
      };

      for (const page of pages.slice(1)) {
        emit(`${page.path.slice(1)}/index.html`, template.replace(SEO_BLOCK, wrap(headHtml(pageSeo(page, { base, contact })))));
      }

      // Legacy single-page version (/one-page) duplicates the home page: point search engines at "/".
      const homeSeo = pageSeo(home, { base, contact });
      emit('one-page/index.html', template.replace(SEO_BLOCK, wrap(headHtml({ ...homeSeo, canonical: base ? `${base}/` : '' }))));

      // Real 404 status for unknown URLs (Vercel serves 404.html). Not indexable.
      const notFound = {
        title: 'Page not found — Ram Jatan Kumar Sah',
        description: "The page you are looking for doesn't exist or has moved.",
        canonical: '',
        image: '',
        imageAlt: '',
        robots: 'noindex, nofollow',
        jsonLd: [],
      };
      emit('404.html', template.replace(SEO_BLOCK, wrap(headHtml(notFound))));
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // On Vercel, fall back to the project's production domain so canonical/OG tags and the sitemap work without extra setup.
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = env.VITE_SITE_URL || (vercelHost ? `https://${vercelHost}` : '');
  const contact = { email: env.VITE_CONTACT_EMAIL || DEFAULTS.email, phone: env.VITE_CONTACT_PHONE || DEFAULTS.phone };
  return {
    plugins: [react(), tailwindcss(), seoPlugin(siteUrl, contact)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      fs: { allow: ['..'] },
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      // No manual vendor chunks: hand-written react/motion groups created a circular chunk import
      // ("Cannot read properties of null (reading 'useContext')"). Vite's automatic splitting keeps the
      // lazy 3D scenes in their own chunks and is safe.
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
      css: false,
    },
  };
});
