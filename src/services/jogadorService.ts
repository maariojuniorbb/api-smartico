import { getAllPreferencias, JogadorPreferencia } from '../repositories/jogadorRepository';
import { atualizarJogador } from './smarticoService';
import logger from '../config/logger';

interface ResultadoAtualizacao {
  message?: string;
}

export async function sincronizarPreferencias(): Promise<ResultadoAtualizacao> {
  const jogadores: JogadorPreferencia[] = await getAllPreferencias();

for (let i = 0; i < jogadores.length; i++) {
    const jogador = jogadores[i];
    try {
      await atualizarJogador(jogador);
      
    } catch (e: any) {
      throw new Error(`Erro ao atualizar jogador ${jogador.jogador_codigo}: ${e?.message}`);
    }
  }

  logger.info('Sincronização concluída. Total jogadores processados: %d', jogadores.length);
  return {message: 'success'};
}
