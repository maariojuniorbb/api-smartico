# Configuração do Databricks

## Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env`:

```env
DATABRICKS_HOST=your-databricks-host.cloud.databricks.com
DATABRICKS_HTTP_PATH=/sql/1.0/warehouses/your-warehouse-id
DATABRICKS_TOKEN=your-databricks-access-token
```

### Como obter as credenciais:

1. **DATABRICKS_HOST**: URL do seu workspace Databricks (ex: `adb-1234567890123456.7.azuredatabricks.net`)
2. **DATABRICKS_HTTP_PATH**: Caminho HTTP do seu SQL Warehouse (encontrado nas configurações do warehouse)
3. **DATABRICKS_TOKEN**: Token de acesso pessoal (PAT) gerado nas configurações de usuário

## Endpoints Disponíveis

### 1. Executar Query Customizada
```bash
POST /api/databricks/query
Content-Type: application/json

{
  "query": "SELECT * FROM seu_catalogo.seu_schema.sua_tabela LIMIT 10"
}
```

### 2. Buscar Dados de uma Tabela
```bash
GET /api/databricks/table/seu_catalogo.seu_schema.sua_tabela?limit=100
```

### 3. Buscar Dados com Filtros
```bash
POST /api/databricks/table/seu_catalogo.seu_schema.sua_tabela/filter?limit=100
Content-Type: application/json

{
  "whereClause": "coluna = 'valor' AND outra_coluna > 10"
}
```

## Exemplos de Uso

### Exemplo 1: Executar Query SQL
```bash
curl -X POST http://localhost:4000/api/databricks/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM catalog.schema.table LIMIT 5"
  }'
```

### Exemplo 2: Buscar Dados de Tabela
```bash
curl http://localhost:4000/api/databricks/table/catalog.schema.table?limit=50
```

### Exemplo 3: Buscar com Filtros
```bash
curl -X POST http://localhost:4000/api/databricks/table/catalog.schema.table/filter?limit=100 \
  -H "Content-Type: application/json" \
  -d '{
    "whereClause": "status = '\''active'\'' AND created_at >= '\''2024-01-01'\''"
  }'
```

## Estrutura dos Arquivos Adicionados

```
src/
├── config/
│   └── databricks.ts          # Configuração de conexão com Databricks
├── controllers/
│   └── databricksController.ts # Controller para endpoints Databricks
├── repositories/
│   └── databricksRepository.ts # Repository para queries Databricks
├── routes/
│   └── databricksRoutes.ts    # Rotas da API Databricks
└── services/
    └── databricksService.ts   # Lógica de negócio Databricks
```

## Observações

- A conexão com Databricks é gerenciada automaticamente
- As queries são executadas de forma assíncrona
- Limite padrão de resultados: 100 registros (configurável)
- Logs são gerados para todas as operações
- A estrutura existente do projeto não foi modificada
