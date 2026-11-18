import type { Alimento } from '../../../dominio/entidades/Alimento.js';
import type { IRepositorioAlimento } from '../../../dominio/repositorios/IRepositorioAlimento.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class BuscarAlimento {
  constructor(private readonly repositorio: IRepositorioAlimento) {}

  async executar(id: string): Promise<Alimento> {
    const alimento = await this.repositorio.buscarPorId(id);
    if (!alimento) {
      throw new ErroDeDominio('Alimento não encontrado.');
    }
    return alimento;
  }
}
