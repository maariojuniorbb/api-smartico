import { sincronizar } from '../../src/controllers/jogadorController';
import * as jogadorService from '../../src/services/jogadorService';

interface ResultadoAtualizacao {
  jogador_codigo: number;
  status: 'sucesso' | 'erro';
  data?: any;
  mensagem?: any;
}

describe('JogadorController', () => {
  it('deve responder com resultados ao sincronizar', async () => {
    const req: any = {};
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Define com tipo explícito para manter string literal no campo status
    const mockResultado: ResultadoAtualizacao[] = [
      { jogador_codigo: 1, status: 'sucesso' },
    ];

    jest.spyOn(jogadorService, 'sincronizarPreferencias').mockResolvedValue(mockResultado);

    await sincronizar(req, res);

    expect(jogadorService.sincronizarPreferencias).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sincronização finalizada',
      resultados: mockResultado,
    });
  });

  it('deve responder erro 500 ao falhar', async () => {
    const req: any = {};
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(jogadorService, 'sincronizarPreferencias').mockRejectedValue(new Error('Falha'));

    await sincronizar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha' });
  });
});
