import { Alimento } from "../../../dominio/entidades/Alimento.js";
import { IRepositorioAlimento } from "../../../dominio/repositorios/IRepositorioAlimento.js";

export class ListarAlimento {
  constructor(private readonly repositorio: IRepositorioAlimento) {}

  executar(): Promise<Alimento[]> {
    return this.repositorio.listar();
  }
}
