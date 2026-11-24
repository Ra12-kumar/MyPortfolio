import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/**
 * Generates robots.txt and sitemap.xml at build time from VITE_SITE_URL, and
 * injects absolute canonical / Open Graph URLs into index.html. Nothing is
 * emitted with a placeholder domain: if VITE_SITE_URL is missing, the
 * sitemap and absolute URLs are simply omitted.
 */
function seoPlugin(siteUrl) {
  const base = siteUrl ? siteUrl.replace(/\/$/, '') : '';
  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      const tags = base
        ? `<link rel="canonical" href="${base}/" />\n    <meta property="og:url" content="${base}/" />\n    <meta property="og:image" content="${base}/og-image.png" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:image" content="${base}/og-image.png" />`
        : '';
      return html.replace('<!--seo-urls-->', tags);
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', base ? `Sitemap: ${base}/sitemap.xml` : '']
        .filter(Boolean)
        .join('\n');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` });
      if (base) {
        const today = new Date().toISOString().slice(0, 10);
        const routes = [['/', '1.0'], ['/about', '0.8'], ['/services', '0.9'], ['/projects', '0.8'], ['/process', '0.6'], ['/testimonials', '0.6'], ['/contact', '0.9']];
        const urls = routes
          .map(([route, priority]) => `  <url><loc>${base}${route}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`)
          .join('\n');
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // On Vercel, fall back to the project's production domain so canonical/OG tags and the sitemap work without extra setup.
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = env.VITE_SITE_URL || (vercelHost ? `https://${vercelHost}` : '');
  return {
    plugins: [react(), tailwindcss(), seoPlugin(siteUrl)],
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
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion';
            if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react';
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
      css: false,
    },
  };
});
