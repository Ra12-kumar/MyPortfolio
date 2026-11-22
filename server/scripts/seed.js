/**
 * Seeds services, projects and FAQs from shared/content.js into Supabase.
 * Idempotent: rows are upserted by slug, so re-running updates them.
 * Testimonials are never seeded — add verified feedback via the admin panel.
 *
 * Usage: npm run seed   (requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
 */
import { createClient } from '@supabase/supabase-js';
import { services, projects, faqs } from '../../shared/content.js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see server/.env.example).');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const rows = {
  services: services.map((s, i) => ({
    slug: s.slug, title: s.title, description: s.description, icon: s.icon,
    features: s.features, project_type: s.projectType, sort_order: i, is_published: true,
  })),
  projects: projects.map((p, i) => ({
    slug: p.slug, title: p.title, category: p.category, summary: p.summary, features: p.features,
    business_value: p.businessValue, architecture: p.architecture, preview_key: p.previewKey,
    image_url: p.imageUrl, demo_url: p.demoUrl, github_url: p.githubUrl, sort_order: i, is_published: true,
  })),
  faqs: faqs.map((f, i) => ({ slug: f.slug, question: f.question, answer: f.answer, sort_order: i, is_published: true })),
};

for (const [table, data] of Object.entries(rows)) {
  const { error } = await db.from(table).upsert(data, { onConflict: 'slug' });
  if (error) {
    console.error(`Failed to seed ${table}:`, error.message);
    process.exit(1);
  }
  console.log(`Seeded ${data.length} ${table}`);
}
console.log('Done.');
