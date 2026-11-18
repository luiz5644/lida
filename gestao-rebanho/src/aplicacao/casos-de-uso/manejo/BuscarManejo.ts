import type { Manejo } from '../../../dominio/entidades/Manejo.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class BuscarManejo {
  constructor(private readonly repositorio: IRepositorioManejo) {}

  async executar(id: string): Promise<Manejo> {
    const manejo = await this.repositorio.buscarPorId(id);
    if (!manejo) {
      throw new ErroDeDominio('Manejo não encontrado.');
    }
    return manejo;
  }
}
