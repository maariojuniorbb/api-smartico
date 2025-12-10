import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Aumenta o timeout para 5 minutos (300000ms) para consultas longas ao Databricks
server.timeout = 300000;
server.keepAliveTimeout = 300000;
server.headersTimeout = 310000;
