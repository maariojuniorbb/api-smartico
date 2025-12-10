import { Request, Response } from 'express';
import { sincronizarPreferencias, sincronizarNiveisFraude } from '../services/jogadorService';
import logger from '../config/logger';

export async function sincronizar_preferencias(_req: Request, res: Response) {
  try {
    const startTime = new Date();

    const resultados = await sincronizarPreferencias();

    const endTime = new Date();

    const duration = endTime.getTime() - startTime.getTime();

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    res.json({
      statuscode: 200,
      message: `Sincronização de preferencias finalizada em ${formattedTime}`,
      resultados,
    });
    
  } catch (error: any) {
    logger.error('Erro na sincronização: %o', error);
    res.status(500).json({ error: error.message });
  }
}

export async function sincronizar_nivel_fraude(_req: Request, res: Response) {
  try {
    const startTime = new Date();

    const resultados = await sincronizarNiveisFraude();

    const endTime = new Date();

    const duration = endTime.getTime() - startTime.getTime();

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    res.json({
      statuscode: 200,
      message: `Sincronização niveis de fraude finalizada em ${formattedTime}`,
      resultados,
    });
  } catch (error: any) {
    logger.error('Erro na sincronização: %o', error);
    res.status(500).json({ error: error.message });
  }
}
