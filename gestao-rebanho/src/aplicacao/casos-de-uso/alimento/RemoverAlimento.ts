import type { IRepositorioAlimento } from '../../../dominio/repositorios/IRepositorioAlimento.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverAlimento {
  constructor(private readonly repositorio: IRepositorioAlimento) {}

  async executar(id: string): Promise<void> {
    const alimento = await this.repositorio.buscarPorId(id);
    if (!alimento) {
      throw new ErroDeDominio('Alimento não encontrado.');
    }
    await this.repositorio.remover(id);
  }
}
