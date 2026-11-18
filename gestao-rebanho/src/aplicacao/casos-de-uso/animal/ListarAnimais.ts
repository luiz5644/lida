import type { Animal } from '../../../dominio/entidades/Animal.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';

export class ListarAnimais {
  constructor(private readonly repositorio: IRepositorioAnimal) {}

  async executar(propriedadeId?: string): Promise<Animal[]> {
    if (propriedadeId) {
      return this.repositorio.listarPorPropriedade(propriedadeId);
    }
    return this.repositorio.listar();
  }
}
