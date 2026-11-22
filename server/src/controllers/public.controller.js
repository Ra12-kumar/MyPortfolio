import * as contentService from '../services/content.service.js';
import * as inquiryService from '../services/inquiry.service.js';
import { generateReply } from '../services/chat.service.js';

const PUBLIC_CACHE = 'public, max-age=60, stale-while-revalidate=300';

export const listContent = (resource) => async (_req, res) => {
  const items = await contentService.listPublished(resource);
  res.set('Cache-Control', PUBLIC_CACHE).json({ data: items });
};

export async function submitInquiry(req, res) {
  const result = await inquiryService.createInquiry(req.body);
  res.status(201).json({
    data: { received: result.accepted },
    message: 'Thank you! Your inquiry has been received. I will review it and get back to you soon.',
  });
}

export async function chat(req, res) {
  const result = await generateReply(req.body.messages);
  res.json({ data: result });
}
