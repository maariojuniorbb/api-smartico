import axios from 'axios';
import { atualizarJogador } from '../../src/services/smarticoService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SmarticoService', () => {
  const jogadorMock = {
    jogador_codigo: 1,
    top_win_1: 'Jogo1',
    top_win_2: null,
    top_win_3: null,
    top_win_provider: 'Prov1',
    top_amount_1: 'Jogo2',
    top_amount_2: null,
    top_amount_3: null,
    top_amount_provider: 'Prov2',
    top_spin_1: 'Jogo3',
    top_spin_2: null,
    top_spin_3: null,
    top_spin_provider: 'Prov3',
  };

  it('deve enviar dados com sucesso', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    const response = await atualizarJogador(jogadorMock);

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(response.status).toBe('sucesso');
  });

  it('deve retornar erro ao falhar', async () => {
    mockedAxios.post.mockRejectedValue({ message: 'Erro API' });

    const response = await atualizarJogador(jogadorMock);

    expect(response.status).toBe('erro');
    expect(response.mensagem).toBe('Erro API');
  });
});
