import { getAllPreferencias, getAllNiveisFraude, JogadorPreferencia, NiveisFraude, updateViewPreferencies, updateViewNiveisFraude } from '../repositories/jogadorRepository';
import { atualizarJogadorLote, atualizarNiveisFraudeLote } from './smarticoService';
import logger from '../config/logger';

interface ResultadoAtualizacao {
  message?: string;
}

export async function sincronizarPreferencias(): Promise<ResultadoAtualizacao> {
  const jogadores: JogadorPreferencia[] = await getAllPreferencias();
  const lotes = [];

  while (jogadores.length) {
    lotes.push(jogadores.splice(0, 600));
  }

  logger.info('Total de jogadores a serem processados: ', jogadores.length);

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

export async function atualizarViewPreferencias(): Promise<ResultadoAtualizacao> {
  try {
    const result = await updateViewPreferencies();
    
    logger.info('View preferências atualizada com sucesso', result);
  } catch (error) {
    logger.error('Erro ao atualizar a view de preferências', error);
  }

  logger.info('Atualização concluída.');
  return { message: 'success' };
}

export async function sincronizarNiveisFraude(): Promise<ResultadoAtualizacao> {
  const niveisFraude: NiveisFraude[] = await getAllNiveisFraude();
  const lotes = [];

  while (niveisFraude.length) {
    lotes.push(niveisFraude.splice(0, 600));
  }

  logger.info('Total de jogadores a serem processados: ', niveisFraude.length);

  for (let i = 0; i < lotes.length; i++) {
    const jogadoresLote = lotes[i];
    
    try {
      await atualizarNiveisFraudeLote(jogadoresLote);
      
      logger.info('Lote %d atualizado com sucesso', i + 1);
    } catch (error) {
      logger.error('Erro ao atualizar o lote %d: %o', i + 1, error);
    }
  }

  logger.info('Sincronização concluída. Total de jogadores processados: %d', niveisFraude.length);
  return { message: 'success' };
}

export async function atualizarViewNiveisFraude(): Promise<ResultadoAtualizacao> {
  try {
    const result = await updateViewNiveisFraude();
    
    logger.info('View níveis de fraude atualizada com sucesso', result);
  } catch (error) {
    logger.error('Erro ao atualizar a view de níveis de fraude', error);
  }

  logger.info('Atualização concluída.');
  return { message: 'success' };
}


