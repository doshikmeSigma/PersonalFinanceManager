export class ApiError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, ApiError);
  }

  static badRequest(message = 'Некорректный запрос', details) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Требуется авторизация') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Доступ запрещён') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Ресурс не найден') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message = 'Конфликт данных') {
    return new ApiError(409, 'CONFLICT', message);
  }
}