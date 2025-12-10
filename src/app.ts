import express from 'express';
import jogadorRoutes from './routes/jogadorRoutes';
import databricksRoutes from './routes/databricksRoutes';

const app = express();

app.use(express.json());

// Aumenta o timeout das requisições para 5 minutos
app.use((req, res, next) => {
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
});

app.use('/api', jogadorRoutes);
app.use('/api/databricks', databricksRoutes);

export default app;
