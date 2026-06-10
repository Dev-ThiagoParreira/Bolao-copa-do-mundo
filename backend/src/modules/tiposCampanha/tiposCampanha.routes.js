import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as controller from './tiposCampanha.controller.js';
import {
  createTipoCampanhaSchema,
  idParamSchema,
  updateTipoCampanhaSchema,
} from './tiposCampanha.schema.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', validate(idParamSchema), controller.getById);

router.use(authenticate, authorize('ADMIN'));
router.post('/', validate(createTipoCampanhaSchema), controller.create);
router.put('/:id', validate(updateTipoCampanhaSchema), controller.update);
router.delete('/:id', validate(idParamSchema), controller.remove);

export default router;
