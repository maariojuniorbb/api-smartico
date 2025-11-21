import getDatabricksClient from '../config/databricks';
import logger from '../config/logger';

export class DatabricksRepository {
  /**
   * Executa uma query no Databricks e retorna os resultados
   */
  async executeQuery(query: string): Promise<any[]> {
    const client = await getDatabricksClient();
    const session = await client.openSession();

    try {
      logger.info('Executando query no Databricks', { query });
      
      const queryOperation = await session.executeStatement(query, {
        runAsync: false,
        maxRows: 10000,
      });

      const result = await queryOperation.fetchAll();
      await queryOperation.close();
      
      logger.info('Query executada com sucesso', { rowCount: result.length });
      return result;
    } catch (error: any) {
      logger.error('Erro ao executar query no Databricks', { 
        error: error.message,
        stack: error.stack,
        query 
      });
      throw error;
    } finally {
      await session.close();
    }
  }
}

export default new DatabricksRepository();
