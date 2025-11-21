import 'dotenv/config';
import getDatabricksClient from './src/config/databricks';

async function testarConexao() {
  try {
    console.log('Testando conexão com Databricks...');
    const client = await getDatabricksClient();
    const session = await client.openSession();
    console.log('✓ Conectado\n');

    // Listar schemas no catálogo apostatudobetbr
    console.log('=== SCHEMAS NO CATÁLOGO apostatudobetbr ===');
    try {
      const schemasOp = await session.executeStatement('SHOW SCHEMAS IN apostatudobetbr', {
        runAsync: false,
        maxRows: 100,
      });
      const schemas = await schemasOp.fetchAll();
      console.log('Schemas:', JSON.stringify(schemas, null, 2));
      await schemasOp.close();

      // Testar cada schema
      for (const schemaRow of schemas) {
        const schemaName = (schemaRow as any).namespace || (schemaRow as any).databaseName || (schemaRow as any).schema_name;
        console.log(`\n=== TABELAS NO apostatudobetbr.${schemaName} ===`);
        try {
          const tablesOp = await session.executeStatement(`SHOW TABLES IN apostatudobetbr.${schemaName}`, {
            runAsync: false,
            maxRows: 100,
          });
          const tables = await tablesOp.fetchAll();
          console.log('Tabelas:', JSON.stringify(tables, null, 2));
          await tablesOp.close();
        } catch (e: any) {
          console.log('Erro:', e.message);
        }
      }
    } catch (e: any) {
      console.log('Erro ao listar schemas:', e.message);
    }

    await session.close();
    console.log('\n✓ Teste finalizado');
    process.exit(0);
  } catch (error: any) {
    console.error('✗ Erro:', error.message);
    process.exit(1);
  }
}

testarConexao();
