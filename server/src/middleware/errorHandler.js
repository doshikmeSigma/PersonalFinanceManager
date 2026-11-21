import { config } from '../config.js';
import { ApiError } from '../utils/ApiError.js';

export function errorHandler(err, req, res, next) {
  let error = err;

  if (err.type === 'entity.parse.failed') {
    error = ApiError.badRequest('Некорректный JSON в теле запроса');
  } else if (err.type === 'entity.too.large') {
    error = new ApiError(413, 'PAYLOAD_TOO_LARGE', 'Превышен размер тела запроса');
  } else if (!(err instanceof ApiError)) {
    error = new ApiError(500, 'INTERNAL_ERROR', 'Внутренняя ошибка сервера');
  }

  if (error.statusCode >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(error.statusCode).json({
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
      stack: config.env === 'development' ? err.stack : undefined,
    },
  });
}