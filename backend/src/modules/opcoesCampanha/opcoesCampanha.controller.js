import * as service from './opcoesCampanha.service.js';
import { successResponse } from '../../utils/response.js';

/**
 * @swagger
 * /campanhas/{campanhaId}/opcoes:
 *   get:
 *     tags: [OpcoesCampanha]
 *     summary: Listar opções de uma campanha
 *     security: []
 */
export async function listByCampanha(req, res, next) {
  try {
    const data = await service.listByCampanha(Number(req.params.campanhaId));
    return successResponse(res, data, 'Opções listadas com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /opcoes-campanha/{id}:
 *   get:
 *     tags: [OpcoesCampanha]
 *     summary: Buscar opção por ID
 *     security: []
 */
export async function getById(req, res, next) {
  try {
    const data = await service.getById(Number(req.params.id));
    return successResponse(res, data, 'Opção encontrada');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /opcoes-campanha:
 *   post:
 *     tags: [OpcoesCampanha]
 *     summary: Criar opção de campanha
 */
export async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return successResponse(res, data, 'Opção criada com sucesso', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /opcoes-campanha/{id}:
 *   put:
 *     tags: [OpcoesCampanha]
 *     summary: Atualizar opção
 */
export async function update(req, res, next) {
  try {
    const data = await service.update(Number(req.params.id), req.body);
    return successResponse(res, data, 'Opção atualizada com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /opcoes-campanha/{id}:
 *   delete:
 *     tags: [OpcoesCampanha]
 *     summary: Remover opção
 */
export async function remove(req, res, next) {
  try {
    await service.remove(Number(req.params.id));
    return successResponse(res, null, 'Opção removida com sucesso');
  } catch (error) {
    return next(error);
  }
}
