import type { Propriedade } from '../../../dominio/entidades/Propriedade.js';
import type { IRepositorioPropriedade } from '../../../dominio/repositorios/IRepositorioPropriedade.js';

export class ListarPropriedades {
  constructor(private readonly repositorio: IRepositorioPropriedade) {}

  async executar(usuarioId?: string): Promise<Propriedade[]> {
    if (usuarioId) {
      return this.repositorio.listarPorUsuario(usuarioId);
    }
    return this.repositorio.listar();
  }
}
