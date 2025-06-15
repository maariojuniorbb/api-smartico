import * as jogadorRepo from '../../src/repositories/jogadorRepository';
import * as smarticoService from '../../src/services/smarticoService';
import { sincronizarPreferencias } from '../../src/services/jogadorService';

jest.mock('../../src/repositories/jogadorRepository');
jest.mock('../../src/services/smarticoService');

describe('JogadorService', () => {
  it('deve sincronizar preferências para todos jogadores', async () => {
    const mockJogadores = [
      { jogador_codigo: 1 } as any,
      { jogador_codigo: 2 } as any,
    ];

    (jogadorRepo.getAllPreferencias as jest.Mock).mockResolvedValue(mockJogadores);
    (smarticoService.atualizarJogador as jest.Mock).mockResolvedValue({ status: 'sucesso' });

    const resultados = await sincronizarPreferencias();

    expect(jogadorRepo.getAllPreferencias).toHaveBeenCalled();
    expect(smarticoService.atualizarJogador).toHaveBeenCalledTimes(mockJogadores.length);
    expect(resultados.length).toBe(2);
  });
});
