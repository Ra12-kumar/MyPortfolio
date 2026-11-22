import { AppError } from '../utils/AppError.js';
import { sanitizeDeep } from '../utils/sanitize.js';

/**
 * Validates and sanitizes req[source] against a zod schema. The parsed value
 * replaces the original, so unknown keys are stripped.
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(sanitizeDeep(req[source] ?? {}));
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return next(AppError.badRequest('Validation failed', details));
  }
  if (source === 'query') {
    // req.query is a getter in Express 5; keep a separate property for safety.
    req.validatedQuery = result.data;
  } else {
    req[source] = result.data;
  }
  return next();
};
