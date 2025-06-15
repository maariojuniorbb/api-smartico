import { Router } from 'express';
import { sincronizar } from '../controllers/jogadorController';

const router = Router();

router.post('/sincronizar-preferencias', sincronizar);

router.get('/health-check', (_req, res) => {
  res.status(200).json({ message: 'API is running' });
});

export default router;
