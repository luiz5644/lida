import type { IRepositorioUsuario } from '../../../dominio/repositorios/IRepositorioUsuario.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverUsuario {
  constructor(private readonly repositorio: IRepositorioUsuario) {}

  async executar(id: string): Promise<void> {
    const usuario = await this.repositorio.buscarPorId(id);
    if (!usuario) {
      throw new ErroDeDominio('Usuário não encontrado.');
    }
    await this.repositorio.remover(id);
  }
}
