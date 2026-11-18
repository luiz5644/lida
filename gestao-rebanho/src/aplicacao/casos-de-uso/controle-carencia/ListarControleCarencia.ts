import { ControleCarencia } from "../../../dominio/entidades/ControleCarencia.js";
import { IRepositorioControleCarencia } from "../../../dominio/repositorios/IRepositorioControleCarencia.js";

export class ListarControleCarencia {
  constructor(private readonly repositorio: IRepositorioControleCarencia) {}

  executar(): Promise<ControleCarencia[]> {
    return this.repositorio.listar();
  }
}
