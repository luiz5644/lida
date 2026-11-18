import type { Lote } from '../../../dominio/entidades/Lote.js';
import type { IRepositorioLote } from '../../../dominio/repositorios/IRepositorioLote.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class BuscarLote {
  constructor(private readonly repositorio: IRepositorioLote) {}

  async executar(id: string): Promise<Lote> {
    const lote = await this.repositorio.buscarPorId(id);
    if (!lote) {
      throw new ErroDeDominio('Lote não encontrado.');
    }
    return lote;
  }
}
