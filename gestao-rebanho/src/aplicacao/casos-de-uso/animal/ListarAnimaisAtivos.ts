import type { Animal } from '../../../dominio/entidades/Animal.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';

export class ListarAnimaisAtivos {
  constructor(private readonly repositorio: IRepositorioAnimal) {}

  async executar(propriedadeId?: string): Promise<Animal[]> {
    let animais: Animal[];
    if (propriedadeId) {
      animais = await this.repositorio.listarPorPropriedade(propriedadeId);
    } else {
      animais = await this.repositorio.listar();
    }
    return animais.filter((a) => a.status === StatusAnimal.ATIVO);
  }
}
