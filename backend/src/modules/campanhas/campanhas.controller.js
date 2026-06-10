import * as service from './campanhas.service.js';
import { successResponse } from '../../utils/response.js';

/**
 * @swagger
 * /campanhas:
 *   get:
 *     tags: [Campanhas]
 *     summary: Listar campanhas
 *     security: []
 */
export async function list(req, res, next) {
  try {
    const data = await service.list();
    return successResponse(res, data, 'Campanhas listadas com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /campanhas/{id}:
 *   get:
 *     tags: [Campanhas]
 *     summary: Buscar campanha
 *     security: []
 */
export async function getById(req, res, next) {
  try {
    const data = await service.getById(Number(req.params.id));
    return successResponse(res, data, 'Campanha encontrada');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /campanhas:
 *   post:
 *     tags: [Campanhas]
 *     summary: Criar campanha
 */
export async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return successResponse(res, data, 'Campanha criada com sucesso', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /campanhas/{id}:
 *   put:
 *     tags: [Campanhas]
 *     summary: Atualizar campanha
 */
export async function update(req, res, next) {
  try {
    const data = await service.update(Number(req.params.id), req.body);
    return successResponse(res, data, 'Campanha atualizada com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /campanhas/{id}:
 *   delete:
 *     tags: [Campanhas]
 *     summary: Remover campanha
 */
export async function remove(req, res, next) {
  try {
    await service.remove(Number(req.params.id));
    return successResponse(res, null, 'Campanha removida com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /campanhas/{id}/resultado-final:
 *   patch:
 *     tags: [Campanhas]
 *     summary: Definir opção vencedora da campanha
 */
export async function definirResultadoFinal(req, res, next) {
  try {
    const data = await service.definirResultadoFinal(Number(req.params.id), req.body.opcaoId);
    return successResponse(res, data, 'Resultado final definido com sucesso');
  } catch (error) {
    return next(error);
  }
}
