import * as service from './tiposCampanha.service.js';
import { successResponse } from '../../utils/response.js';

/**
 * @swagger
 * /tipos-campanha:
 *   get:
 *     tags: [TiposCampanha]
 *     summary: Listar tipos de campanha
 *     security: []
 *     responses:
 *       200:
 *         description: Lista retornada
 */
export async function list(req, res, next) {
  try {
    const data = await service.list();
    return successResponse(res, data, 'Tipos de campanha listados com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /tipos-campanha/{id}:
 *   get:
 *     tags: [TiposCampanha]
 *     summary: Buscar tipo de campanha
 *     security: []
 */
export async function getById(req, res, next) {
  try {
    const data = await service.getById(Number(req.params.id));
    return successResponse(res, data, 'Tipo de campanha encontrado');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /tipos-campanha:
 *   post:
 *     tags: [TiposCampanha]
 *     summary: Criar tipo de campanha
 */
export async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return successResponse(res, data, 'Tipo de campanha criado com sucesso', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /tipos-campanha/{id}:
 *   put:
 *     tags: [TiposCampanha]
 *     summary: Atualizar tipo de campanha
 */
export async function update(req, res, next) {
  try {
    const data = await service.update(Number(req.params.id), req.body);
    return successResponse(res, data, 'Tipo de campanha atualizado com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /tipos-campanha/{id}:
 *   delete:
 *     tags: [TiposCampanha]
 *     summary: Remover tipo de campanha
 */
export async function remove(req, res, next) {
  try {
    await service.remove(Number(req.params.id));
    return successResponse(res, null, 'Tipo de campanha removido com sucesso');
  } catch (error) {
    return next(error);
  }
}
