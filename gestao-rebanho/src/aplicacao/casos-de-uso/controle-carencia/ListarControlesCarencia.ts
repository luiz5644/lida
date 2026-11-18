import type { ControleCarencia } from '../../../dominio/entidades/ControleCarencia.js';
import type { IRepositorioControleCarencia } from '../../../dominio/repositorios/IRepositorioControleCarencia.js';

export class ListarControlesCarencia {
  constructor(private readonly repositorio: IRepositorioControleCarencia) {}

  async executar(animalId?: string): Promise<ControleCarencia[]> {
    if (animalId) {
      return this.repositorio.listarPorAnimal(animalId);
    }
    return this.repositorio.listar();
  }
}
