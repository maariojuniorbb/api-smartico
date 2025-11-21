import databricksRepository, { DatabricksRepository } from '../repositories/databricksRepository';
import logger from '../config/logger';

export class DatabricksService {
  private databricksRepository: DatabricksRepository;

  constructor(repository: DatabricksRepository = databricksRepository) {
    this.databricksRepository = repository;
  }

  async executarQueryTeste(): Promise<any[]> {
    try {
      logger.info('Executando query de teste no Databricks');
      
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
