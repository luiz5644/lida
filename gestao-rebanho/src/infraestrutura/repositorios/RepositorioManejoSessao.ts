import { Manejo, ManejoProps } from '../../dominio/entidades/Manejo.js';
import { IRepositorioManejo } from '../../dominio/repositorios/IRepositorioManejo.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'manejos';

export class RepositorioManejoSessao extends RepositorioBaseSessao implements IRepositorioManejo {
  async criar(manejo: Manejo): Promise<Manejo> {
    const itens = this.listarTodos<ManejoProps>(CHAVE);
    itens.push(manejo.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return manejo;
  }

  async listar(): Promise<Manejo[]> {
    return this.listarTodos<ManejoProps>(CHAVE).map(Manejo.deJSON);
  }

  async listarPorAnimal(animalId: string): Promise<Manejo[]> {
    return this.listarTodos<ManejoProps>(CHAVE)
      .filter(m => m.animalId === animalId)
      .map(Manejo.deJSON);
  }

  async listarPorLote(loteId: string): Promise<Manejo[]> {
    return this.listarTodos<ManejoProps>(CHAVE)
      .filter(m => m.loteId === loteId)
      .map(Manejo.deJSON);
  }

  async buscarPorId(id: string): Promise<Manejo | null> {
    const props = this.listarTodos<ManejoProps>(CHAVE).find(m => m.id === id);
    return props ? Manejo.deJSON(props) : null;
  }

  async atualizar(manejo: Manejo): Promise<Manejo> {
    const itens = this.listarTodos<ManejoProps>(CHAVE);
    const idx = itens.findIndex(m => m.id === manejo.id);
    if (idx !== -1) {
      itens[idx] = manejo.paraJSON();
      this.salvarTodos(CHAVE, itens);
    }
    return manejo;
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<ManejoProps>(CHAVE).filter(m => m.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
