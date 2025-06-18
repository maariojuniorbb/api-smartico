import { getAllPreferencias, JogadorPreferencia } from '../repositories/jogadorRepository';
import { atualizarJogadorLote } from './smarticoService';
import logger from '../config/logger';

interface ResultadoAtualizacao {
  message?: string;
}

export async function sincronizarPreferencias(): Promise<ResultadoAtualizacao> {
  const jogadores: JogadorPreferencia[] = await getAllPreferencias();
  const lotes = [];

  while (jogadores.length) {
    lotes.push(jogadores.splice(0, 200));
  }

  for (let i = 0; i < lotes.length; i++) {
    const jogadoresLote = lotes[i];
    try {
      await atualizarJogadorLote(jogadoresLote);
      
      logger.info('Lote %d atualizado com sucesso', i + 1);
    } catch (error) {
      logger.error('Erro ao atualizar o lote %d: %o', i + 1, error);
    }
  }

  logger.info('Sincronização concluída. Total de jogadores processados: %d', jogadores.length);
  return { message: 'success' };
}


