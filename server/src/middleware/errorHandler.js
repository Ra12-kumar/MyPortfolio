import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';

export function notFoundHandler(req, _res, next) {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  // Body parser errors (malformed JSON / payload too large)
  if (err.type === 'entity.parse.failed') {
    err = AppError.badRequest('Malformed JSON body');
  } else if (err.type === 'entity.too.large') {
    err = new AppError(413, 'Request body too large', { code: 'PAYLOAD_TOO_LARGE' });
  } else if (err.name === 'MulterError') {
    err = AppError.badRequest(err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 5 MB)' : err.message);
  }

  const status = err instanceof AppError ? err.statusCode : 500;

  if (status >= 500) {
    logger.error({ err, reqId: req.id, path: req.originalUrl }, 'Unhandled error');
  } else {
    logger.warn({ status, code: err.code, reqId: req.id, path: req.originalUrl }, err.message);
  }

  res.status(status).json({
    error: {
      code: err.code || (status >= 500 ? 'INTERNAL_ERROR' : 'ERROR'),
      message: status >= 500 && !(err instanceof AppError) ? 'Something went wrong. Please try again later.' : err.message,
      ...(err.details ? { details: err.details } : {}),
      requestId: req.id,
    },
  });
}
