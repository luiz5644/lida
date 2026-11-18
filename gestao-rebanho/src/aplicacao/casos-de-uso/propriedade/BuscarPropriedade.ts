import type { Propriedade } from '../../../dominio/entidades/Propriedade.js';
import type { IRepositorioPropriedade } from '../../../dominio/repositorios/IRepositorioPropriedade.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class BuscarPropriedade {
  constructor(private readonly repositorio: IRepositorioPropriedade) {}

  async executar(id: string): Promise<Propriedade> {
    const propriedade = await this.repositorio.buscarPorId(id);
    if (!propriedade) {
      throw new ErroDeDominio('Propriedade não encontrada.');
    }
    return propriedade;
  }
}
