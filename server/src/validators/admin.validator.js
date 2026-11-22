import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(6).max(200),
});

const slug = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only');

const httpsUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^https:\/\/[^\s]+$/.test(v), 'Must be a full https:// URL');

const stringList = (maxItems = 30, maxLen = 200) =>
  z.array(z.string().trim().min(1).max(maxLen)).max(maxItems).default([]);

const optText = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

const common = {
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
  isPublished: z.boolean().default(true),
};

export const projectSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(10).max(1500),
  features: stringList(),
  businessValue: stringList(),
  architecture: stringList(),
  previewKey: z.enum(['gym', 'consultancy', 'shop', 'generic']).nullable().default('generic'),
  imageUrl: httpsUrl,
  demoUrl: httpsUrl,
  githubUrl: httpsUrl,
  ...common,
});

export const serviceSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(1000),
  icon: optText(60),
  features: stringList(12, 120),
  projectType: optText(80),
  ...common,
});

export const faqSchema = z.object({
  slug,
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(3000),
  ...common,
});

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  clientRole: optText(120),
  company: optText(160),
  quote: z.string().trim().min(10).max(1500),
  rating: z.coerce.number().int().min(1).max(5).nullable().optional().default(null),
  projectId: z.string().uuid().nullable().optional().default(null),
  isVerified: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  sortOrder: common.sortOrder,
}).refine((t) => !t.isPublished || t.isVerified, {
  message: 'Only verified testimonials can be published',
  path: ['isPublished'],
});
