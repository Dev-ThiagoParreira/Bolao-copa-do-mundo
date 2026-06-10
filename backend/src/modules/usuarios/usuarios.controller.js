import * as usuariosService from './usuarios.service.js';
import { successResponse } from '../../utils/response.js';

/**
 * @swagger
 * /usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
export async function list(req, res, next) {
  try {
    const users = await usuariosService.list();
    return successResponse(res, users, 'Usuários listados com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Buscar usuário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
export async function getById(req, res, next) {
  try {
    const user = await usuariosService.getById(Number(req.params.id));
    return successResponse(res, user, 'Usuário encontrado');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Atualizar usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
export async function update(req, res, next) {
  try {
    const user = await usuariosService.update(Number(req.params.id), req.body, req.user);
    return successResponse(res, user, 'Usuário atualizado com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Remover usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário removido
 */
export async function remove(req, res, next) {
  try {
    await usuariosService.remove(Number(req.params.id));
    return successResponse(res, null, 'Usuário removido com sucesso');
  } catch (error) {
    return next(error);
  }
}
