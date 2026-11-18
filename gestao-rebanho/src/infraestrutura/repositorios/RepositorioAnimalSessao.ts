import { Animal, AnimalProps } from '../../dominio/entidades/Animal.js';
import { IRepositorioAnimal } from '../../dominio/repositorios/IRepositorioAnimal.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'animais';

export class RepositorioAnimalSessao extends RepositorioBaseSessao implements IRepositorioAnimal {
  async criar(animal: Animal): Promise<Animal> {
    const itens = this.listarTodos<AnimalProps>(CHAVE);
    itens.push(animal.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return animal;
  }

  async listar(): Promise<Animal[]> {
    return this.listarTodos<AnimalProps>(CHAVE).map(Animal.deJSON);
  }

  async listarPorPropriedade(propriedadeId: string): Promise<Animal[]> {
    return this.listarTodos<AnimalProps>(CHAVE)
      .filter(a => a.propriedadeId === propriedadeId)
      .map(Animal.deJSON);
  }

  async listarPorLote(loteId: string): Promise<Animal[]> {
    return this.listarTodos<AnimalProps>(CHAVE)
      .filter(a => a.loteId === loteId)
      .map(Animal.deJSON);
  }

  async buscarPorId(id: string): Promise<Animal | null> {
    const props = this.listarTodos<AnimalProps>(CHAVE).find(a => a.id === id);
    return props ? Animal.deJSON(props) : null;
  }

  async atualizar(animal: Animal): Promise<Animal> {
    const itens = this.listarTodos<AnimalProps>(CHAVE);
    const idx = itens.findIndex(a => a.id === animal.id);
    if (idx !== -1) {
      itens[idx] = animal.paraJSON();
      this.salvarTodos(CHAVE, itens);
    }
    return animal;
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<AnimalProps>(CHAVE).filter(a => a.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
