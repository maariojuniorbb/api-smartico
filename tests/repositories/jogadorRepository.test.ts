import { getAllPreferencias, JogadorPreferencia } from '../../src/repositories/jogadorRepository';
import pool from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
}));

describe('JogadorRepository', () => {
  it('deve retornar lista de preferências', async () => {
    const mockRows: JogadorPreferencia[] = [
      {
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
      },
    ];

    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    const result = await getAllPreferencias();

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM mv_jogadores_preferencias');
    expect(result).toEqual(mockRows);
  });
});
