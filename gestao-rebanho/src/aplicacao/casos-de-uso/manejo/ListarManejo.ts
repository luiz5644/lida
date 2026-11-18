import { Manejo } from "../../../dominio/entidades/Manejo.js";
import { IRepositorioManejo } from "../../../dominio/repositorios/IRepositorioManejo.js";

export class ListarManejo {
  constructor(private readonly repositorio: IRepositorioManejo) {}

  executar(): Promise<Manejo[]> {
    return this.repositorio.listar();
  }
}
