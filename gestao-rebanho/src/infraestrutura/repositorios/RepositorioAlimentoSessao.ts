import { Alimento, AlimentoProps } from '../../dominio/entidades/Alimento.js';
import { IRepositorioAlimento } from '../../dominio/repositorios/IRepositorioAlimento.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'alimentos';

export class RepositorioAlimentoSessao extends RepositorioBaseSessao implements IRepositorioAlimento {
  async criar(alimento: Alimento): Promise<Alimento> {
    const itens = this.listarTodos<AlimentoProps>(CHAVE);
    itens.push(alimento.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return alimento;
  }

  async listar(): Promise<Alimento[]> {
    return this.listarTodos<AlimentoProps>(CHAVE).map(Alimento.deJSON);
  }

  async buscarPorId(id: string): Promise<Alimento | null> {
    const props = this.listarTodos<AlimentoProps>(CHAVE).find(a => a.id === id);
    return props ? Alimento.deJSON(props) : null;
  }

  async atualizar(alimento: Alimento): Promise<Alimento> {
    const itens = this.listarTodos<AlimentoProps>(CHAVE);
    const idx = itens.findIndex(a => a.id === alimento.id);
    if (idx !== -1) {
      itens[idx] = alimento.paraJSON();
      this.salvarTodos(CHAVE, itens);
    }
    return alimento;
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<AlimentoProps>(CHAVE).filter(a => a.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
