import * as content from '../../../shared/content.js';
import { projectSchema, serviceSchema, faqSchema, testimonialSchema } from '../validators/admin.validator.js';

/**
 * Content resource definitions: DB table, camelCase <-> snake_case field map,
 * the admin validation schema, and the static fallback used when Supabase is
 * not configured (local development).
 */
export const resources = {
  projects: {
    table: 'projects',
    schema: projectSchema,
    fields: {
      slug: 'slug', title: 'title', category: 'category', summary: 'summary', features: 'features',
      businessValue: 'business_value', architecture: 'architecture', previewKey: 'preview_key',
      imageUrl: 'image_url', demoUrl: 'demo_url', githubUrl: 'github_url', sortOrder: 'sort_order',
      isPublished: 'is_published',
    },
    publicFilter: (q) => q.eq('is_published', true),
    fallback: () => content.projects.map((p, i) => ({ id: p.slug, ...p, sortOrder: i, isPublished: true })),
  },
  services: {
    table: 'services',
    schema: serviceSchema,
    fields: {
      slug: 'slug', title: 'title', description: 'description', icon: 'icon', features: 'features',
      projectType: 'project_type', sortOrder: 'sort_order', isPublished: 'is_published',
    },
    publicFilter: (q) => q.eq('is_published', true),
    fallback: () => content.services.map((s, i) => ({ id: s.slug, ...s, sortOrder: i, isPublished: true })),
  },
  faqs: {
    table: 'faqs',
    schema: faqSchema,
    fields: { slug: 'slug', question: 'question', answer: 'answer', sortOrder: 'sort_order', isPublished: 'is_published' },
    publicFilter: (q) => q.eq('is_published', true),
    fallback: () => content.faqs.map((f, i) => ({ id: f.slug, ...f, sortOrder: i, isPublished: true })),
  },
  testimonials: {
    table: 'testimonials',
    schema: testimonialSchema,
    fields: {
      clientName: 'client_name', clientRole: 'client_role', company: 'company', quote: 'quote', rating: 'rating',
      projectId: 'project_id', isVerified: 'is_verified', isPublished: 'is_published', sortOrder: 'sort_order',
    },
    // Public visitors only ever see verified + published feedback.
    publicFilter: (q) => q.eq('is_published', true).eq('is_verified', true),
    fallback: () => content.testimonials.filter((t) => t.isVerified && t.isPublished),
  },
};

export function toApi(resource, row) {
  if (!row) return row;
  const out = { id: row.id };
  for (const [api, db] of Object.entries(resource.fields)) out[api] = row[db];
  if (row.created_at) out.createdAt = row.created_at;
  if (row.updated_at) out.updatedAt = row.updated_at;
  return out;
}

export function toDb(resource, data) {
  const out = {};
  for (const [api, db] of Object.entries(resource.fields)) {
    if (data[api] !== undefined) out[db] = data[api];
  }
  return out;
}
