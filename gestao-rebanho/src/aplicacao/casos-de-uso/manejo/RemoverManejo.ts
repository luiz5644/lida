import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverManejo {
  constructor(private readonly repositorio: IRepositorioManejo) {}

  async executar(id: string): Promise<void> {
    const manejo = await this.repositorio.buscarPorId(id);
    if (!manejo) {
      throw new ErroDeDominio('Manejo não encontrado.');
    }
    await this.repositorio.remover(id);
  }
}
