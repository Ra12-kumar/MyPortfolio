import * as authService from '../services/auth.service.js';
import * as contentService from '../services/content.service.js';
import * as inquiryService from '../services/inquiry.service.js';
import { uploadProjectImage } from '../services/storage.service.js';
import { clearKnowledgeCache } from '../services/knowledgeBase.js';
import { logger } from '../config/logger.js';

export async function login(req, res) {
  const session = await authService.loginAdmin(req.body);
  res.json({ data: session });
}

export function me(req, res) {
  res.json({ data: req.user });
}

export async function listInquiries(req, res) {
  res.json({ data: await inquiryService.listInquiries(req.validatedQuery) });
}

export async function updateInquiry(req, res) {
  const updated = await inquiryService.updateInquiry(req.params.id, req.body);
  logger.info({ adminId: req.user.id, inquiryId: updated.id, status: updated.status }, 'Inquiry updated');
  res.json({ data: updated });
}

export async function deleteInquiry(req, res) {
  await inquiryService.deleteInquiry(req.params.id);
  logger.info({ adminId: req.user.id, inquiryId: req.params.id }, 'Inquiry deleted');
  res.status(204).end();
}

export async function analytics(_req, res) {
  res.json({ data: await inquiryService.getAnalytics() });
}

export async function upload(req, res) {
  res.status(201).json({ data: await uploadProjectImage(req.file) });
}

/** Generic CRUD handlers for a content resource (projects, services, faqs, testimonials). */
export const contentCrud = (resource) => ({
  list: async (_req, res) => res.json({ data: await contentService.listAll(resource) }),
  create: async (req, res) => {
    const item = await contentService.create(resource, req.body);
    clearKnowledgeCache();
    res.status(201).json({ data: item });
  },
  update: async (req, res) => {
    const item = await contentService.update(resource, req.params.id, req.body);
    clearKnowledgeCache();
    res.json({ data: item });
  },
  remove: async (req, res) => {
    await contentService.remove(resource, req.params.id);
    clearKnowledgeCache();
    res.status(204).end();
  },
});
