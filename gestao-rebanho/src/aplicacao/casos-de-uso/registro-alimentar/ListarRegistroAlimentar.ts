import { RegistroAlimentar } from "../../../dominio/entidades/RegistroAlimentar.js";
import { IRepositorioRegistroAlimentar } from "../../../dominio/repositorios/IRepositorioRegistroAlimentar.js";

export class ListarRegistroAlimentar {
  constructor(private readonly repositorio: IRepositorioRegistroAlimentar) {}

  executar(): Promise<RegistroAlimentar[]> {
    return this.repositorio.listar();
  }
}
