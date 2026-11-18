import { ProdutoSanitario, ProdutoSanitarioProps } from '../../dominio/entidades/ProdutoSanitario.js';
import { IRepositorioProdutoSanitario } from '../../dominio/repositorios/IRepositorioProdutoSanitario.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'produtos-sanitarios';

export class RepositorioProdutoSanitarioSessao extends RepositorioBaseSessao implements IRepositorioProdutoSanitario {
  async criar(produto: ProdutoSanitario): Promise<ProdutoSanitario> {
    const itens = this.listarTodos<ProdutoSanitarioProps>(CHAVE);
    itens.push(produto.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return produto;
  }

  async listar(): Promise<ProdutoSanitario[]> {
    return this.listarTodos<ProdutoSanitarioProps>(CHAVE).map(ProdutoSanitario.deJSON);
  }

  async buscarPorId(id: string): Promise<ProdutoSanitario | null> {
    const props = this.listarTodos<ProdutoSanitarioProps>(CHAVE).find(p => p.id === id);
    return props ? ProdutoSanitario.deJSON(props) : null;
  }

  async atualizar(produto: ProdutoSanitario): Promise<ProdutoSanitario> {
    const itens = this.listarTodos<ProdutoSanitarioProps>(CHAVE);
    const idx = itens.findIndex(p => p.id === produto.id);
    if (idx !== -1) {
      itens[idx] = produto.paraJSON();
      this.salvarTodos(CHAVE, itens);
    }
    return produto;
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<ProdutoSanitarioProps>(CHAVE).filter(p => p.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
