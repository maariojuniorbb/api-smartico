import { DBSQLClient } from '@databricks/sql';
import logger from './logger';

let client: DBSQLClient | null = null;

export const getDatabricksClient = async () => {
  if (client) {
    return client;
  }

  const host = process.env.DATABRICKS_HOST;
  const path = process.env.DATABRICKS_HTTP_PATH;
  const token = process.env.DATABRICKS_TOKEN;

  // Validação das variáveis
  if (!host || !path || !token) {
    const missing = [];
    if (!host) missing.push('DATABRICKS_HOST');
    if (!path) missing.push('DATABRICKS_HTTP_PATH');
    if (!token) missing.push('DATABRICKS_TOKEN');
    
    logger.error('Variáveis de ambiente do Databricks não configuradas', { missing });
    throw new Error(`Variáveis de ambiente faltando: ${missing.join(', ')}`);
  }

  logger.info('Conectando ao Databricks', { host, path });

  client = new DBSQLClient();

  await client.connect({
    host,
    path,
    token,
    socketTimeout: 300000, // 5 minutos
    connectionTimeout: 300000, // 5 minutos
  });

  logger.info('Conectado ao Databricks com sucesso');
  return client;
};

export const closeDatabricksConnection = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};

export default getDatabricksClient;
