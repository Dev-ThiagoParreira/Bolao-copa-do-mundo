import { ZodError } from 'zod';
import { AppError, errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return errorResponse(res, 'Dados inválidos', 400, err.errors);
  }

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.errors);
  }

  console.error(err);
  return errorResponse(res, 'Erro interno do servidor', 500);
}

export function notFoundHandler(req, res) {
  return errorResponse(res, `Rota ${req.method} ${req.originalUrl} não encontrada`, 404);
}
