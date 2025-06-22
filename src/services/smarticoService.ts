import axios from 'axios';
import logger from '../config/logger';
import { SMARTICO_API_URL, SMARTICO_API_TOKEN } from '../config/smartico';
import { JogadorPreferencia, NiveisFraude } from '../repositories/jogadorRepository';
import { v4 as uuidv4 } from 'uuid';

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

    const date = new Date('2025-05-23T15:30:00Z');
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

    const date = new Date('2025-05-23T15:30:00Z');
    const event_date = date.getTime();

    return {
      eid: uuidv4(),
      event_date,
      ext_brand_id: 'apostatudobetbr',
      user_ext_id: codigo.toString(),
      event_type: 'update_profile',
      payload: {
        core_custom_prop3: nivel,
      },
    };
  });
  
  logger.info(`iniciando a atualização de ${payload.length} níveis de fraude no Smartico`);
  try {
    await axios.post(SMARTICO_API_URL, payload, {
      headers: {
        Authorization: SMARTICO_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    logger.info('Lote de níveis de fraude de jogadores atualizado com sucesso');
  } catch (error: any) {
    logger.error('Erro ao atualizar lote de níveis de fraude de jogadores: %o', error.response?.data || error.message);
    throw new Error('Erro ao atualizar lote de níveis de fraude de jogadores');
  }
}
