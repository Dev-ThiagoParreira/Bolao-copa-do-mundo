import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as controller from './opcoesCampanha.controller.js';
import {
  campanhaParamSchema,
  createOpcaoSchema,
  idParamSchema,
  updateOpcaoSchema,
} from './opcoesCampanha.schema.js';

const router = Router();

router.get('/:id', validate(idParamSchema), controller.getById);

router.use(authenticate, authorize('ADMIN'));
router.post('/', validate(createOpcaoSchema), controller.create);
router.put('/:id', validate(updateOpcaoSchema), controller.update);
router.delete('/:id', validate(idParamSchema), controller.remove);

export default router;
