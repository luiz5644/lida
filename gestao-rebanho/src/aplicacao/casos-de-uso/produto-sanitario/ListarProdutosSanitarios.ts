import type { ProdutoSanitario } from '../../../dominio/entidades/ProdutoSanitario.js';
import type { IRepositorioProdutoSanitario } from '../../../dominio/repositorios/IRepositorioProdutoSanitario.js';

export class ListarProdutosSanitarios {
  constructor(private readonly repositorio: IRepositorioProdutoSanitario) {}

  async executar(): Promise<ProdutoSanitario[]> {
    return this.repositorio.listar();
  }
}
