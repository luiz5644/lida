import type { Lote } from '../../../dominio/entidades/Lote.js';
import type { IRepositorioLote } from '../../../dominio/repositorios/IRepositorioLote.js';

export class ListarLotes {
  constructor(private readonly repositorio: IRepositorioLote) {}

  async executar(propriedadeId?: string): Promise<Lote[]> {
    if (propriedadeId) {
      return this.repositorio.listarPorPropriedade(propriedadeId);
    }
    return this.repositorio.listar();
  }
}
