import express from 'express';
import jogadorRoutes from './routes/jogadorRoutes';
import databricksRoutes from './routes/databricksRoutes';

const app = express();

app.use(express.json());

app.use('/api', jogadorRoutes);
app.use('/api/databricks', databricksRoutes);

export default app;
