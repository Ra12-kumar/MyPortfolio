import { z } from 'zod';
import { inquiryOptions } from '@shared/content.js';

const optional = (max, label) => z.string().trim().max(max, `${label} is too long`).optional().or(z.literal(''));

export const inquirySchema = z
  .object({
    fullName: z.string().trim().min(2, 'Please enter your full name').max(120, 'Name is too long'),
    email: z.string().trim().min(1, 'Please enter your email').email('Please enter a valid email address').max(254),
    phone: z
      .string()
      .trim()
      .max(32, 'Phone number is too long')
      .refine((v) => v === '' || /^[+\d][\d\s\-().]{5,31}$/.test(v), 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    company: optional(160, 'Company name'),
    businessType: optional(120, 'Business type'),
    projectType: z.enum(inquiryOptions.projectTypes, { errorMap: () => ({ message: 'Please choose a project type' }) }),
    description: z
      .string()
      .trim()
      .min(20, 'Please describe your project in at least 20 characters')
      .max(5000, 'Please keep the description under 5000 characters'),
    requiredFeatures: optional(3000, 'Required features'),
    budget: optional(60, 'Budget'),
    timeline: optional(60, 'Timeline'),
    preferredContact: z.enum(inquiryOptions.contactMethods),
    website: z.string().optional(), // honeypot
  })
  .superRefine((v, ctx) => {
    if ((v.preferredContact === 'Phone' || v.preferredContact === 'WhatsApp') && !v.phone) {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: `Please add a phone number for ${v.preferredContact} contact` });
    }
  });

export const inquiryDefaults = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  businessType: '',
  projectType: '',
  description: '',
  requiredFeatures: '',
  budget: '',
  timeline: '',
  preferredContact: 'Email',
  website: '',
};
