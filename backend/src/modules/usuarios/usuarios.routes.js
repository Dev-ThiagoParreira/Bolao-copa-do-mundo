import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as usuariosController from './usuarios.controller.js';
import { idParamSchema, updateUsuarioSchema } from './usuarios.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN'), usuariosController.list);
router.get('/:id', validate(idParamSchema), usuariosController.getById);
router.put('/:id', validate(updateUsuarioSchema), usuariosController.update);
router.delete('/:id', authorize('ADMIN'), validate(idParamSchema), usuariosController.remove);

export default router;
