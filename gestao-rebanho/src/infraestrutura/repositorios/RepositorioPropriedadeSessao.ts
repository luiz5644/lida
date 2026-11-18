import { Propriedade, PropriedadeProps } from '../../dominio/entidades/Propriedade.js';
import { IRepositorioPropriedade } from '../../dominio/repositorios/IRepositorioPropriedade.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'propriedades';

export class RepositorioPropriedadeSessao extends RepositorioBaseSessao implements IRepositorioPropriedade {
  async criar(propriedade: Propriedade): Promise<Propriedade> {
    const itens = this.listarTodos<PropriedadeProps>(CHAVE);
    itens.push(propriedade.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return propriedade;
  }

  async listar(): Promise<Propriedade[]> {
    return this.listarTodos<PropriedadeProps>(CHAVE).map(Propriedade.deJSON);
  }

  async listarPorUsuario(usuarioId: string): Promise<Propriedade[]> {
    return this.listarTodos<PropriedadeProps>(CHAVE)
      .filter(p => p.usuarioId === usuarioId)
      .map(Propriedade.deJSON);
  }

  async buscarPorId(id: string): Promise<Propriedade | null> {
    const props = this.listarTodos<PropriedadeProps>(CHAVE).find(p => p.id === id);
    return props ? Propriedade.deJSON(props) : null;
  }

  async atualizar(propriedade: Propriedade): Promise<Propriedade> {
    const itens = this.listarTodos<PropriedadeProps>(CHAVE);
    const idx = itens.findIndex(p => p.id === propriedade.id);
    if (idx !== -1) {
      itens[idx] = propriedade.paraJSON();
      this.salvarTodos(CHAVE, itens);
    }
    return propriedade;
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<PropriedadeProps>(CHAVE).filter(p => p.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
