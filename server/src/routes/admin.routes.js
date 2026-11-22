import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { loginLimiter } from '../middleware/rateLimiters.js';
import { loginSchema } from '../validators/admin.validator.js';
import { idParamSchema, listInquiriesSchema, updateInquirySchema } from '../validators/inquiry.validator.js';
import { resources } from '../services/resources.js';
import * as ctrl from '../controllers/admin.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

// Public: login only.
router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(ctrl.login));

// Everything below requires an authenticated admin.
router.use(requireAdmin);

router.get('/me', ctrl.me);

router.get('/inquiries', validate(listInquiriesSchema, 'query'), asyncHandler(ctrl.listInquiries));
router.get('/inquiries/analytics', asyncHandler(ctrl.analytics));
router.patch('/inquiries/:id', validate(idParamSchema, 'params'), validate(updateInquirySchema), asyncHandler(ctrl.updateInquiry));
router.delete('/inquiries/:id', validate(idParamSchema, 'params'), asyncHandler(ctrl.deleteInquiry));

router.post('/uploads', upload.single('file'), asyncHandler(ctrl.upload));

for (const [name, resource] of Object.entries(resources)) {
  const crud = ctrl.contentCrud(name);
  router.get(`/${name}`, asyncHandler(crud.list));
  router.post(`/${name}`, validate(resource.schema), asyncHandler(crud.create));
  router.put(`/${name}/:id`, validate(idParamSchema, 'params'), validate(resource.schema), asyncHandler(crud.update));
  router.delete(`/${name}/:id`, validate(idParamSchema, 'params'), asyncHandler(crud.remove));
}

export default router;
