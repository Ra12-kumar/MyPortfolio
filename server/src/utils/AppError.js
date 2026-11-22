export class AppError extends Error {
  constructor(statusCode, message, { code, details } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.expose = true;
  }

  static badRequest(message = 'Bad request', details) {
    return new AppError(400, message, { code: 'BAD_REQUEST', details });
  }
  static unauthorized(message = 'Authentication required') {
    return new AppError(401, message, { code: 'UNAUTHORIZED' });
  }
  static forbidden(message = 'You do not have permission to perform this action') {
    return new AppError(403, message, { code: 'FORBIDDEN' });
  }
  static notFound(message = 'Resource not found') {
    return new AppError(404, message, { code: 'NOT_FOUND' });
  }
  static conflict(message, code = 'CONFLICT') {
    return new AppError(409, message, { code });
  }
  static unavailable(message = 'Service temporarily unavailable', code = 'SERVICE_UNAVAILABLE') {
    return new AppError(503, message, { code });
  }
}
