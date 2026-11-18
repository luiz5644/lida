import type { Alimento } from '../../../dominio/entidades/Alimento.js';
import type { IRepositorioAlimento } from '../../../dominio/repositorios/IRepositorioAlimento.js';

export class ListarAlimentos {
  constructor(private readonly repositorio: IRepositorioAlimento) {}

  async executar(): Promise<Alimento[]> {
    return this.repositorio.listar();
  }
}
