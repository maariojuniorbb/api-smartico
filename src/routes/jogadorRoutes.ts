import { Router } from 'express';
import { sincronizar_preferencias, sincronizar_nivel_fraude } from '../controllers/jogadorController';

const router = Router();

router.get('/sincronizar-preferencias', sincronizar_preferencias);

router.get('/sincronizar-nivel-fraude', sincronizar_nivel_fraude);

router.get('/health-check', (_req, res) => {
  res.status(200).json({ message: 'API is running' });
});

export default router;
