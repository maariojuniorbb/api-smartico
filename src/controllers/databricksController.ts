import { Request, Response } from 'express';
import databricksService, { DatabricksService } from '../services/databricksService';
import logger from '../config/logger';

export class DatabricksController {
  private databricksService: DatabricksService;

  constructor(service: DatabricksService = databricksService) {
    this.databricksService = service;
  }

  /**
   * GET /api/databricks/teste
   * Executa uma query fixa de teste
   */
  executarTeste = async (_req: Request, res: Response): Promise<void> => {
    try {
      logger.info('Recebida requisição para executar teste');

      const results = await this.databricksService.executarQueryTeste();

      res.status(200).json({
        success: true,
        data: results,
        count: results.length,
      });
    } catch (error: any) {
      logger.error('Erro no controller ao executar teste', { 
        message: error.message,
        stack: error.stack,
        name: error.name,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      });
      res.status(500).json({
        error: 'Erro ao executar teste no Databricks',
        message: error.message || 'Erro desconhecido',
        details: error.stack
      });
    }
  };
}

export default new DatabricksController();
