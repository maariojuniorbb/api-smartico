import { Router } from 'express';
import databricksController from '../controllers/databricksController';

const router = Router();

// GET /api/databricks/teste - Rota de teste com SQL fixo
router.get('/teste', databricksController.executarTeste);

export default router;
