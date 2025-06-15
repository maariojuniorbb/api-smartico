import express from 'express';
import jogadorRoutes from './routes/jogadorRoutes';

const app = express();

app.use(express.json());

app.use('/api', jogadorRoutes);

export default app;
