import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as controller from './apostas.controller.js';
import {
  createApostaSchema,
  idParamSchema,
  updateApostaStatusSchema,
} from './apostas.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', validate(idParamSchema), controller.getById);
router.post('/', validate(createApostaSchema), controller.create);
router.patch('/:id/status', authorize('ADMIN'), validate(updateApostaStatusSchema), controller.updateStatus);
router.delete('/:id', validate(idParamSchema), controller.remove);

export default router;
