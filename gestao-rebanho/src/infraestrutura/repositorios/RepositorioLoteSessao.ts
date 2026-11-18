import { Lote, LoteProps } from '../../dominio/entidades/Lote.js';
import { IRepositorioLote } from '../../dominio/repositorios/IRepositorioLote.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'lotes';

export class RepositorioLoteSessao extends RepositorioBaseSessao implements IRepositorioLote {
  async criar(lote: Lote): Promise<Lote> {
    const itens = this.listarTodos<LoteProps>(CHAVE);
    itens.push(lote.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return lote;
  }

  async listar(): Promise<Lote[]> {
    return this.listarTodos<LoteProps>(CHAVE).map(Lote.deJSON);
  }

  async listarPorPropriedade(propriedadeId: string): Promise<Lote[]> {
    return this.listarTodos<LoteProps>(CHAVE)
      .filter(l => l.propriedadeId === propriedadeId)
      .map(Lote.deJSON);
  }

  async buscarPorId(id: string): Promise<Lote | null> {
    const props = this.listarTodos<LoteProps>(CHAVE).find(l => l.id === id);
    return props ? Lote.deJSON(props) : null;
  }

  async atualizar(lote: Lote): Promise<Lote> {
    const itens = this.listarTodos<LoteProps>(CHAVE);
    const idx = itens.findIndex(l => l.id === lote.id);
    if (idx !== -1) {
      itens[idx] = lote.paraJSON();
      this.salvarTodos(CHAVE, itens);
    }
    return lote;
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<LoteProps>(CHAVE).filter(l => l.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
