import type { IRepositorioSessao } from '../../../dominio/repositorios/IRepositorioSessao.js';

export class EncerrarSessao {
  constructor(private readonly sessao: IRepositorioSessao) {}

  async executar(): Promise<void> {
    await this.sessao.limpar();
  }
}
