import type { Pesagem } from '../../../dominio/entidades/Pesagem.js';
import type { IRepositorioPesagem } from '../../../dominio/repositorios/IRepositorioPesagem.js';

export class ListarPesagemPorAnimal {
  constructor(private readonly repositorio: IRepositorioPesagem) {}

  async executar(animalId: string): Promise<Pesagem[]> {
    const pesagens = await this.repositorio.listarPorAnimal(animalId);
    return [...pesagens].sort((a, b) => b.data.localeCompare(a.data));
  }
}
