import databricksRepository, { DatabricksRepository } from '../repositories/databricksRepository';
import logger from '../config/logger';

export class DatabricksService {
  private databricksRepository: DatabricksRepository;

  constructor(repository: DatabricksRepository = databricksRepository) {
    this.databricksRepository = repository;
  }

  /**
   * Executa uma query fixa de teste
   * Para alterar o SQL, edite a string query abaixo
   * 
   * Catálogo: apostatudobetbr
   * Schema: silver
   * Tabelas disponíveis: tb_users, tb_charges, tb_transactions, etc.
   */
  async executarQueryTeste(): Promise<any[]> {
    try {
      logger.info('Executando query de teste no Databricks');
      
      // Query fixa - altere conforme necessário
      const query = "SELECT * FROM apostatudobetbr.silver.tb_users LIMIT 10";
      
      const results = await this.databricksRepository.executeQuery(query);
      return results;
    } catch (error: any) {
      logger.error('Erro ao executar query de teste', { 
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }
}

export default new DatabricksService();
