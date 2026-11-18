import { Propriedade } from "../../../dominio/entidades/Propriedade.js";
import { IRepositorioPropriedade } from "../../../dominio/repositorios/IRepositorioPropriedade.js";

export class ListarPropriedade {
  constructor(private readonly repositorio: IRepositorioPropriedade) {}

  executar(usuarioId: string): Promise<Propriedade[]> {
    return this.repositorio.listarPorUsuario(usuarioId);
  }
}
