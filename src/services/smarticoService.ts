import axios from 'axios';
import logger from '../config/logger';
import { SMARTICO_API_URL, SMARTICO_API_TOKEN } from '../config/smartico';
import { JogadorPreferencia } from '../repositories/jogadorRepository';
import { v4 as uuidv4 } from 'uuid';

interface AtualizarResponse {
  jogador_codigo: number;
  status: 'sucesso' | 'erro';
  data?: any;
  mensagem?: any;
}

export async function atualizarJogador(jogador: JogadorPreferencia): Promise<AtualizarResponse> {
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

  const payload = {
    eid: uuidv4(),
    event_date,
    ext_brand_id: 'apostatudobetbr',
    user_ext_id: jogador_codigo.toString(),
    event_type: 'update_profile',
    payload: {
      core_custom_prop2: JSON.stringify(preferencias),
    }
  };

  try {
    const response = await axios.post(SMARTICO_API_URL, payload, {
      headers: {
        Authorization: SMARTICO_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    logger.info('Atualizou jogador %d com sucesso', jogador_codigo);
    return { jogador_codigo, status: 'sucesso', data: response.data };
  } catch (error: any) {
    logger.error('Erro atualizando jogador %d: %o', jogador_codigo, error.response?.data || error.message);
    return {
      jogador_codigo,
      status: 'erro',
      mensagem: error.response?.data || error.message,
    };
  }
}
