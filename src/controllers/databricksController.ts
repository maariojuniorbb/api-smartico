import { Request, Response } from 'express';
import databricksService, { DatabricksService } from '../services/databricksService';
import logger from '../config/logger';

export class DatabricksController {
  private databricksService: DatabricksService;

  constructor(service: DatabricksService = databricksService) {
    this.databricksService = service;
  }

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

  testarPreferencias = async (_req: Request, res: Response): Promise<void> => {
    try {
      logger.info('Recebida requisição para testar preferências');

      const results = await this.databricksService.testarPreferencias();

      res.status(200).json({
        success: true,
        message: 'Query de preferências executada com sucesso',
        data: results,
        count: results.length,
      });
    } catch (error: any) {
      logger.error('Erro ao testar preferências', { 
        message: error.message,
        stack: error.stack
      });
      res.status(500).json({
        error: 'Erro ao testar query de preferências',
        message: error.message || 'Erro desconhecido',
        details: error.stack
      });
    }
  };

  testarNiveisFraude = async (_req: Request, res: Response): Promise<void> => {
    try {
      logger.info('Recebida requisição para testar níveis de fraude');

      const results = await this.databricksService.testarNiveisFraude();

      res.status(200).json({
        success: true,
        message: 'Query de níveis de fraude executada com sucesso',
        data: results,
        count: results.length,
      });
    } catch (error: any) {
      logger.error('Erro ao testar níveis de fraude', { 
        message: error.message,
        stack: error.stack
      });
      res.status(500).json({
        error: 'Erro ao testar query de níveis de fraude',
        message: error.message || 'Erro desconhecido',
        details: error.stack
      });
    }
  };
}

export default new DatabricksController();
