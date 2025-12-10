import { Router } from 'express';
import databricksController from '../controllers/databricksController';

const router = Router();

// GET /api/databricks/teste - Rota de teste com SQL fixo (users)
router.get('/teste', databricksController.executarTeste);

// GET /api/databricks/teste-preferencias - Testa query de preferências (10 primeiros)
router.get('/teste-preferencias', databricksController.testarPreferencias);

// GET /api/databricks/teste-niveis-fraude - Testa query de níveis de fraude (10 primeiros)
router.get('/teste-niveis-fraude', databricksController.testarNiveisFraude);

export default router;
