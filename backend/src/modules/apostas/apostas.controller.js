import * as service from './apostas.service.js';
import { successResponse } from '../../utils/response.js';

/**
 * @swagger
 * /apostas:
 *   get:
 *     tags: [Apostas]
 *     summary: Listar apostas do usuário ou todas (admin)
 */
export async function list(req, res, next) {
  try {
    const data = await service.list(req.user);
    return successResponse(res, data, 'Apostas listadas com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /apostas/{id}:
 *   get:
 *     tags: [Apostas]
 *     summary: Buscar aposta por ID
 */
export async function getById(req, res, next) {
  try {
    const data = await service.getById(Number(req.params.id), req.user);
    return successResponse(res, data, 'Aposta encontrada');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /apostas:
 *   post:
 *     tags: [Apostas]
 *     summary: Criar aposta
 */
export async function create(req, res, next) {
  try {
    const data = await service.create(req.body, req.user.id);
    return successResponse(res, data, 'Aposta criada com sucesso', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /apostas/{id}/status:
 *   patch:
 *     tags: [Apostas]
 *     summary: Atualizar status da aposta
 */
export async function updateStatus(req, res, next) {
  try {
    const data = await service.updateStatus(Number(req.params.id), req.body.status, req.user);
    return successResponse(res, data, 'Status da aposta atualizado com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /apostas/{id}:
 *   delete:
 *     tags: [Apostas]
 *     summary: Remover aposta
 */
export async function remove(req, res, next) {
  try {
    await service.remove(Number(req.params.id), req.user);
    return successResponse(res, null, 'Aposta removida com sucesso');
  } catch (error) {
    return next(error);
  }
}
