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
        ? `<link rel="canonical" href="${base}/" />\n    <meta property="og:url" content="${base}/" />\n    <meta property="og:image" content="${base}/og-image.svg" />\n    <meta name="twitter:image" content="${base}/og-image.svg" />`
        : '';
      return html.replace('<!--seo-urls-->', tags);
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', 'Disallow: /admin', base ? `Sitemap: ${base}/sitemap.xml` : '']
        .filter(Boolean)
        .join('\n');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` });
      if (base) {
        const today = new Date().toISOString().slice(0, 10);
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), tailwindcss(), seoPlugin(env.VITE_SITE_URL)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
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
