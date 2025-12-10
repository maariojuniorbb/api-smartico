import getDatabricksClient from '../config/databricks';
import logger from '../config/logger';

export class DatabricksRepository {
  /**
   * Executa uma query no Databricks e retorna os resultados
   * Para grandes volumes, busca em chunks para evitar problemas de memória
   */
  async executeQuery(query: string): Promise<any[]> {
    const client = await getDatabricksClient();
    const session = await client.openSession();

    try {
      logger.info('Executando query no Databricks', { query });
      
      const queryOperation = await session.executeStatement(query, {
        runAsync: false,
      });

      // Busca os dados em chunks de 100k linhas para evitar problemas de memória
      const allResults: any[] = [];
      let chunk;
      let chunkCount = 0;
      
      do {
        chunk = await queryOperation.fetchChunk({ maxRows: 100000 });
        if (chunk && chunk.length > 0) {
          allResults.push(...chunk);
          chunkCount++;
          logger.info(`Chunk ${chunkCount} buscado: ${chunk.length} linhas (Total acumulado: ${allResults.length})`);
        }
      } while (chunk && chunk.length > 0);

      await queryOperation.close();
      
      logger.info('Query executada com sucesso', { totalRows: allResults.length, chunks: chunkCount });
      return allResults;
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
