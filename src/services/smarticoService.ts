import axios from 'axios';
import logger from '../config/logger';
import { SMARTICO_API_URL, SMARTICO_API_TOKEN } from '../config/smartico';
import { JogadorPreferencia, NiveisFraude } from '../repositories/jogadorRepository';
import { v4 as uuidv4 } from 'uuid';

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetriable = error.code === 'EAI_AGAIN' || 
                          error.code === 'ENOTFOUND' || 
                          error.code === 'ETIMEDOUT' ||
                          error.response?.status >= 500;

      if (isLastAttempt || !isRetriable) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      logger.warn(`Tentativa ${attempt + 1} falhou. Aguardando ${delay}ms antes de tentar novamente...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Máximo de tentativas excedido');
}

export async function atualizarJogadorLote(jogadores: JogadorPreferencia[]): Promise<void> {
  const payload = jogadores.map((jogador) => {
    const {
      jogador_codigo,
      top_win_1,
      top_win_2,
      top_win_3,
      top_win_provider,
      top_amount_1,
      top_amount_2,
      top_amount_3,
      top_amount_provider,
      top_spin_1,
      top_spin_2,
      top_spin_3,
      top_spin_provider,
    } = jogador;

    const preferencias = {
      top_win_1,
      top_win_2,
      top_win_3,
      top_win_provider,
      top_amount_1,
      top_amount_2,
      top_amount_3,
      top_amount_provider,
      top_spin_1,
      top_spin_2,
      top_spin_3,
      top_spin_provider,
    };

    const date = new Date();
    const event_date = date.getTime();

    return {
      eid: uuidv4(),
      event_date,
      ext_brand_id: 'apostatudobetbr',
      user_ext_id: jogador_codigo.toString(),
      event_type: 'update_profile',
      payload: {
        core_custom_prop2: JSON.stringify(preferencias),
      },
    };
  });

  logger.info(`iniciando a atualização de ${payload.length} preferências de jogadores no Smartico`);
  try {
    await axios.post(SMARTICO_API_URL, payload, {
      headers: {
        Authorization: SMARTICO_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    logger.info('Lote de preferências de jogadores atualizado com sucesso');
  } catch (error: any) {
    logger.error('Erro ao atualizar lote de preferências de jogadores: %o', error.response?.data || error.message);
    throw new Error('Erro ao atualizar lote de preferências de jogadores');
  }
}

export async function atualizarNiveisFraudeLote(jogadores: NiveisFraude[]): Promise<void> {
  const payload = jogadores.map((jogador) => {
    const {
      codigo,
      nivel
    } = jogador;

    const date = new Date();
    const event_date = date.getTime();

    return {
      eid: uuidv4(),
      event_date,
      ext_brand_id: 'apostatudobetbr',
      user_ext_id: codigo.toString(),
      event_type: 'update_profile',
      payload: {
        core_custom_prop3: nivel.toString(),
      },
    };
  });
  
  logger.info(`iniciando a atualização de ${payload.length} níveis de fraude no Smartico`);
  
  try {
    await retryWithBackoff(async () => {
      const result = await axios.post(SMARTICO_API_URL, payload, {
        headers: {
          Authorization: SMARTICO_API_TOKEN,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos de timeout
      });
      
      if(result.status !== 200) {
        logger.warn('Resposta não-200 recebida:', result.status);
      }
      
      return result;
    });
    
    logger.info('Lote de níveis de fraude de jogadores atualizado com sucesso');
  } catch (error: any) {
    logger.error('Erro ao atualizar lote de níveis de fraude de jogadores: %o', error.response?.data || error.message);
    throw new Error('Erro ao atualizar lote de níveis de fraude de jogadores');
  }
}
