import type { Animal } from '../../../dominio/entidades/Animal.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';

export class ListarAnimaisDoLote {
  constructor(private readonly repositorioAnimal: IRepositorioAnimal) {}

  async executar(loteId: string): Promise<Animal[]> {
    return this.repositorioAnimal.listarPorLote(loteId);
  }
}
