import { Request, Response } from 'express';
import { sincronizarPreferencias, atualizarView } from '../services/jogadorService';
import logger from '../config/logger';

export async function sincronizar(req: Request, res: Response) {
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

export async function atualizar_view(req: Request, res: Response) {
  try {
    const resultados = await atualizarView();
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
