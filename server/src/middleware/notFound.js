import { ApiError } from '../utils/ApiError.js';

export function notFound(req, res, next) {
  next(ApiError.notFound(`Маршрут ${req.method} ${req.originalUrl} не найден`));
}