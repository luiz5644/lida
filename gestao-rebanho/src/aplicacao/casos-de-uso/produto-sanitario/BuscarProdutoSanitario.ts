import type { ProdutoSanitario } from '../../../dominio/entidades/ProdutoSanitario.js';
import type { IRepositorioProdutoSanitario } from '../../../dominio/repositorios/IRepositorioProdutoSanitario.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class BuscarProdutoSanitario {
  constructor(private readonly repositorio: IRepositorioProdutoSanitario) {}

  async executar(id: string): Promise<ProdutoSanitario> {
    const produto = await this.repositorio.buscarPorId(id);
    if (!produto) {
      throw new ErroDeDominio('Produto sanitário não encontrado.');
    }
    return produto;
  }
}
