import { Router } from 'express';
import { sincronizar, atualizar_view } from '../controllers/jogadorController';

const router = Router();

router.get('/sincronizar-preferencias', sincronizar);

router.get('/update-view', atualizar_view);

router.get('/health-check', (_req, res) => {
  res.status(200).json({ message: 'API is running' });
});

export default router;
