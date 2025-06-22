import { Request, Response } from 'express';
import { sincronizarPreferencias, atualizarViewPreferencias, sincronizarNiveisFraude, atualizarViewNiveisFraude } from '../services/jogadorService';
import logger from '../config/logger';

export async function sincronizar_preferencias(_req: Request, res: Response) {
  try {
    const resultados = await sincronizarPreferencias();
    res.json({
      statuscode: 200,
      message: 'Sincronização finalizada',
      resultados,
    });
  } catch (error: any) {
    logger.error('Erro na sincronização: %o', error);
    res.status(500).json({ error: error.message });
  }
}

export async function atualizar_view_preferencias(_req: Request, res: Response) {
  try {
    const resultados = await atualizarViewPreferencias();
    res.json({
      statuscode: 200,
      message: 'Atualização finalizada',
      resultados,
    });
  } catch (error: any) {
    logger.error('Erro na atualização da view: %o', error);
    res.status(500).json({ error: error.message });
  }
}

export async function sincronizar_nivel_fraude(_req: Request, res: Response) {
  try {
    const resultados = await sincronizarNiveisFraude();
    res.json({
      statuscode: 200,
      message: 'Sincronização finalizada',
      resultados,
    });
  } catch (error: any) {
    logger.error('Erro na sincronização: %o', error);
    res.status(500).json({ error: error.message });
  }
}

export async function atualizar_view_nivel_fraude(_req: Request, res: Response) {
  try {
    const resultados = await atualizarViewNiveisFraude();
    res.json({
      statuscode: 200,
      message: 'Sincronização finalizada',
      resultados,
    });
  } catch (error: any) {
    logger.error('Erro na sincronização: %o', error);
    res.status(500).json({ error: error.message });
  }
}
