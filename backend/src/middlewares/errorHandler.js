import { ZodError } from 'zod';
import { AppError, errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.too.large') {
    return errorResponse(res, 'Imagem do comprovante muito grande. Use uma imagem de até 3MB.', 413);
  }

  if (err?.name === 'PrismaClientValidationError') {
    console.error(err);
    return errorResponse(
      res,
      'Erro de configuração do banco. Execute: npx prisma generate (com o back-end parado)',
      500
    );
  }

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
