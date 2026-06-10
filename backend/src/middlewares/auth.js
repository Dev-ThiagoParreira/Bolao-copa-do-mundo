import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/response.js';

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticação não informado', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Token inválido ou expirado', 401));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Usuário não autenticado', 401);
      }

      if (roles.length && !roles.includes(req.user.tipoUsuario)) {
        throw new AppError('Acesso negado para este perfil', 403);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
