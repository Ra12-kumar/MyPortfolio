import { iconNames } from '@/lib/icons';
import { inquiryOptions } from '@shared/content.js';

/**
 * Field definitions for the generic admin content manager.
 * Types: text | textarea | list (one item per line) | select | checkbox | number | image | url
 */
export const resourceConfigs = {
  projects: {
    title: 'Projects',
    description: 'Featured projects shown on the website. Only add demo/GitHub links that actually work.',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, hint: 'lowercase-with-hyphens' },
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'businessValue', label: 'Business value', type: 'list' },
      { name: 'architecture', label: 'Architecture', type: 'list', hint: 'e.g. React frontend' },
      { name: 'imageUrl', label: 'Screenshot', type: 'image', hint: 'Real screenshots only. Without one, an illustrative mockup is shown.' },
      { name: 'previewKey', label: 'Mockup style (when no screenshot)', type: 'select', options: ['generic', 'gym', 'consultancy', 'shop'] },
      { name: 'demoUrl', label: 'Live demo URL', type: 'url' },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
    ],
    defaults: { features: [], businessValue: [], architecture: [], previewKey: 'generic', sortOrder: 0, isPublished: true },
  },
  services: {
    title: 'Services',
    description: 'Service cards on the website.',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'projectType', label: 'Inquiry type' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icon', type: 'select', options: iconNames },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'projectType', label: 'Pre-selected inquiry type', type: 'select', options: inquiryOptions.projectTypes },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
    ],
    defaults: { features: [], icon: 'Globe', projectType: 'Other', sortOrder: 0, isPublished: true },
  },
  testimonials: {
    title: 'Testimonials',
    description: 'Only real, verified client feedback — added with the client’s permission. Unverified entries are never shown publicly.',
    columns: [
      { key: 'clientName', label: 'Client' },
      { key: 'isVerified', label: 'Verified' },
    ],
    fields: [
      { name: 'clientName', label: 'Client name', type: 'text', required: true },
      { name: 'clientRole', label: 'Role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'quote', label: 'Quote (verbatim)', type: 'textarea', required: true },
      { name: 'rating', label: 'Rating (1–5, only if the client gave one)', type: 'number', nullable: true },
      { name: 'isVerified', label: 'I have verified this feedback is genuine', type: 'checkbox' },
      { name: 'isPublished', label: 'Published (requires verified)', type: 'checkbox' },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
    defaults: { isVerified: false, isPublished: false, sortOrder: 0, rating: null },
  },
  faqs: {
    title: 'FAQs',
    description: 'Questions shown in the FAQ section and used by the AI assistant.',
    columns: [{ key: 'question', label: 'Question' }],
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'sortOrder', label: 'Sort order', type: 'number' },
      { name: 'isPublished', label: 'Published', type: 'checkbox' },
    ],
    defaults: { sortOrder: 0, isPublished: true },
  },
};
