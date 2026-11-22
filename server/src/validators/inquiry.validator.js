import { z } from 'zod';
import { inquiryOptions, inquiryStatuses } from '../../../shared/content.js';

const optionalText = (max) =>
  z
    .string()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() !== '' ? v.trim() : null));

export const createInquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(254),
  phone: optionalText(32).refine((v) => v === null || /^[+\d][\d\s\-().]{5,31}$/.test(v), 'Please enter a valid phone number'),
  company: optionalText(160),
  businessType: optionalText(120),
  projectType: z.enum(inquiryOptions.projectTypes, { errorMap: () => ({ message: 'Please choose a project type' }) }),
  description: z.string().trim().min(20, 'Please describe your project in at least 20 characters').max(5000),
  requiredFeatures: optionalText(3000),
  budget: optionalText(60),
  timeline: optionalText(60),
  preferredContact: z.enum(inquiryOptions.contactMethods).default('Email'),
  source: z.enum(['website', 'chatbot']).default('website'),
  // Anti-spam: hidden honeypot field (must stay empty) and form render time.
  website: z.string().max(200).optional(),
  formStartedAt: z.coerce.number().int().optional(),
});

export const updateInquirySchema = z
  .object({
    status: z.enum(inquiryStatuses).optional(),
    adminNotes: z.string().max(5000).optional().nullable(),
  })
  .refine((v) => v.status !== undefined || v.adminNotes !== undefined, 'Nothing to update');

export const listInquiriesSchema = z.object({
  status: z.enum(inquiryStatuses).optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({ id: z.string().uuid('Invalid id') });
