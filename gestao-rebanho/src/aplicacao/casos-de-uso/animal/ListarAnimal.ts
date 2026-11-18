import { Animal } from "../../../dominio/entidades/Animal.js";
import { IRepositorioAnimal } from "../../../dominio/repositorios/IRepositorioAnimal.js";

export class ListarAnimal {
  constructor(private readonly repositorio: IRepositorioAnimal) {}

  executar(): Promise<Animal[]> {
    return this.repositorio.listar();
  }
}
