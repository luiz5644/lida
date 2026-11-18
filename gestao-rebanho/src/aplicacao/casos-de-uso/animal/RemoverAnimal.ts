import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverAnimal {
  constructor(private readonly repositorio: IRepositorioAnimal) {}

  async executar(id: string): Promise<void> {
    const animal = await this.repositorio.buscarPorId(id);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }
    await this.repositorio.remover(id);
  }
}
