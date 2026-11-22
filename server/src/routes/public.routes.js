import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { chatLimiter, inquiryLimiter } from '../middleware/rateLimiters.js';
import { createInquirySchema } from '../validators/inquiry.validator.js';
import { chatSchema } from '../validators/chat.validator.js';
import * as ctrl from '../controllers/public.controller.js';

const router = Router();

router.get('/projects', asyncHandler(ctrl.listContent('projects')));
router.get('/services', asyncHandler(ctrl.listContent('services')));
router.get('/faqs', asyncHandler(ctrl.listContent('faqs')));
router.get('/testimonials', asyncHandler(ctrl.listContent('testimonials')));

router.post('/inquiries', inquiryLimiter, validate(createInquirySchema), asyncHandler(ctrl.submitInquiry));
router.post('/chat', chatLimiter, validate(chatSchema), asyncHandler(ctrl.chat));

export default router;
