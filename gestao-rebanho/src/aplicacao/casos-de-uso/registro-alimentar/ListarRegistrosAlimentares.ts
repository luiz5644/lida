import type { RegistroAlimentar } from '../../../dominio/entidades/RegistroAlimentar.js';
import type { IRepositorioRegistroAlimentar } from '../../../dominio/repositorios/IRepositorioRegistroAlimentar.js';

export class ListarRegistrosAlimentares {
  constructor(private readonly repositorio: IRepositorioRegistroAlimentar) {}

  async executar(): Promise<RegistroAlimentar[]> {
    return this.repositorio.listar();
  }
}
