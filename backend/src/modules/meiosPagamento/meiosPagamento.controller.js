import * as service from './meiosPagamento.service.js';
import { successResponse } from '../../utils/response.js';

/**
 * @swagger
 * /meios-pagamento:
 *   get:
 *     tags: [MeiosPagamento]
 *     summary: Listar meios de pagamento
 *     security: []
 */
export async function list(req, res, next) {
  try {
    const data = await service.list();
    return successResponse(res, data, 'Meios de pagamento listados com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /meios-pagamento/{id}:
 *   get:
 *     tags: [MeiosPagamento]
 *     summary: Buscar meio de pagamento
 *     security: []
 */
export async function getById(req, res, next) {
  try {
    const data = await service.getById(Number(req.params.id));
    return successResponse(res, data, 'Meio de pagamento encontrado');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /meios-pagamento:
 *   post:
 *     tags: [MeiosPagamento]
 *     summary: Criar meio de pagamento
 */
export async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    return successResponse(res, data, 'Meio de pagamento criado com sucesso', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /meios-pagamento/{id}:
 *   put:
 *     tags: [MeiosPagamento]
 *     summary: Atualizar meio de pagamento
 */
export async function update(req, res, next) {
  try {
    const data = await service.update(Number(req.params.id), req.body);
    return successResponse(res, data, 'Meio de pagamento atualizado com sucesso');
  } catch (error) {
    return next(error);
  }
}

/**
 * @swagger
 * /meios-pagamento/{id}:
 *   delete:
 *     tags: [MeiosPagamento]
 *     summary: Remover meio de pagamento
 */
export async function remove(req, res, next) {
  try {
    await service.remove(Number(req.params.id));
    return successResponse(res, null, 'Meio de pagamento removido com sucesso');
  } catch (error) {
    return next(error);
  }
}
