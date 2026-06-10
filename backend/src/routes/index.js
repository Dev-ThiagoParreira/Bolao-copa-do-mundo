import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usuariosRoutes from '../modules/usuarios/usuarios.routes.js';
import tiposCampanhaRoutes from '../modules/tiposCampanha/tiposCampanha.routes.js';
import campanhasRoutes from '../modules/campanhas/campanhas.routes.js';
import opcoesCampanhaRoutes from '../modules/opcoesCampanha/opcoesCampanha.routes.js';
import meiosPagamentoRoutes from '../modules/meiosPagamento/meiosPagamento.routes.js';
import apostasRoutes from '../modules/apostas/apostas.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API Bolão Copa online' });
});

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/tipos-campanha', tiposCampanhaRoutes);
router.use('/campanhas', campanhasRoutes);
router.use('/opcoes-campanha', opcoesCampanhaRoutes);
router.use('/meios-pagamento', meiosPagamentoRoutes);
router.use('/apostas', apostasRoutes);

export default router;
