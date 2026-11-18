import type { Animal } from '../../../dominio/entidades/Animal.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class BuscarAnimal {
  constructor(private readonly repositorio: IRepositorioAnimal) {}

  async executar(id: string): Promise<Animal> {
    const animal = await this.repositorio.buscarPorId(id);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }
    return animal;
  }
}
