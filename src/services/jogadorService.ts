import { getAllPreferencias, getAllNiveisFraude, JogadorPreferencia, NiveisFraude, updateViewPreferencies, updateViewNiveisFraude } from '../repositories/JogadorRepository';
import { atualizarJogadorLote, atualizarNiveisFraudeLote } from './smarticoService';
import logger from '../config/logger';

interface ResultadoAtualizacao {
  message?: string;
}

export async function sincronizarPreferencias(): Promise<ResultadoAtualizacao> {
  const jogadores: JogadorPreferencia[] = await getAllPreferencias();
  const lotes = [];

  while (jogadores.length) {
    lotes.push(jogadores.splice(0, 400));
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

export async function atualizarViewPreferencias(): Promise<ResultadoAtualizacao> {
  try {
    logger.info('Iniciando atualização da view de preferências');

    await updateViewPreferencies();
    
    logger.info('View preferências atualizada com sucesso');
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
    lotes.push(niveisFraude.splice(0, 400));
  }

  for (let i = 0; i < lotes.length; i++) {
    const jogadoresLote = lotes[i];

    try {
      // Log dos 10 primeiros registros do lote
      const amostra = jogadoresLote.slice(0, 10);
      logger.info('Lote %d - Amostra dos 10 primeiros registros:', i + 1, amostra);
      
      await atualizarNiveisFraudeLote(jogadoresLote);
      
      logger.info('Lote %d atualizado com sucesso (Total: %d registros)', i + 1, jogadoresLote.length);
      
      if (i < lotes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      logger.error('Erro ao atualizar o lote %d: %o', i + 1, error);
    }
  }

  logger.info('Sincronização concluída. Total de jogadores processados: %d', niveisFraude.length);
  return { message: 'success' };
}

export async function atualizarViewNiveisFraude(): Promise<ResultadoAtualizacao> {
  try {
    logger.info('Iniciando atualização da view de níveis de fraude');

    await updateViewNiveisFraude();
    
    logger.info('View níveis de fraude atualizada com sucesso');
  } catch (error) {
    logger.error('Erro ao atualizar a view de níveis de fraude', error);
  }

  logger.info('Atualização concluída.');
  return { message: 'success' };
}


