import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as controller from './campanhas.controller.js';
import * as opcoesController from '../opcoesCampanha/opcoesCampanha.controller.js';
import { campanhaParamSchema } from '../opcoesCampanha/opcoesCampanha.schema.js';
import {
  createCampanhaSchema,
  definirResultadoSchema,
  idParamSchema,
  updateCampanhaSchema,
} from './campanhas.schema.js';

const router = Router();

router.get('/', controller.list);
router.get('/:campanhaId/opcoes', validate(campanhaParamSchema), opcoesController.listByCampanha);
router.get('/:id', validate(idParamSchema), controller.getById);

router.use(authenticate, authorize('ADMIN'));
router.post('/', validate(createCampanhaSchema), controller.create);
router.put('/:id', validate(updateCampanhaSchema), controller.update);
router.delete('/:id', validate(idParamSchema), controller.remove);
router.patch('/:id/resultado-final', validate(definirResultadoSchema), controller.definirResultadoFinal);

export default router;
