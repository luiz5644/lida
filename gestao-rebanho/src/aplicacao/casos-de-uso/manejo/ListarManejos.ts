import type { Manejo } from '../../../dominio/entidades/Manejo.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';

export class ListarManejos {
  constructor(private readonly repositorio: IRepositorioManejo) {}

  async executar(animalId?: string, loteId?: string): Promise<Manejo[]> {
    if (animalId) {
      return this.repositorio.listarPorAnimal(animalId);
    }
    if (loteId) {
      return this.repositorio.listarPorLote(loteId);
    }
    return this.repositorio.listar();
  }
}
