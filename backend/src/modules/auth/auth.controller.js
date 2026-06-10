import * as authService from './auth.service.js';
import { successResponse } from '../../utils/response.js';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Cadastrar novo usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, cpf, email, senha]
 *             properties:
 *               nome: { type: string }
 *               cpf: { type: string }
 *               email: { type: string }
 *               telefone: { type: string }
 *               senha: { type: string }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, 'Usuário cadastrado com sucesso', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autenticar usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email: { type: string }
 *               senha: { type: string }
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body.email, req.body.senha);
    return successResponse(res, result, 'Login realizado com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obter perfil do usuário autenticado
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso
 */
export async function me(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.id);
    return successResponse(res, user, 'Perfil obtido com sucesso');
  } catch (error) {
    return next(error);
  }
}
