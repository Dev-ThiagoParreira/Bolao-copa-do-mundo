import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as controller from './meiosPagamento.controller.js';
import {
  createMeioPagamentoSchema,
  idParamSchema,
  updateMeioPagamentoSchema,
} from './meiosPagamento.schema.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', validate(idParamSchema), controller.getById);

router.use(authenticate, authorize('ADMIN'));
router.post('/', validate(createMeioPagamentoSchema), controller.create);
router.put('/:id', validate(updateMeioPagamentoSchema), controller.update);
router.delete('/:id', validate(idParamSchema), controller.remove);

export default router;
