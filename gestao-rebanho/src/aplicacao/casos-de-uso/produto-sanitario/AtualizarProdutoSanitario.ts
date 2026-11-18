import type { ProdutoSanitario } from '../../../dominio/entidades/ProdutoSanitario.js';
import type { IRepositorioProdutoSanitario } from '../../../dominio/repositorios/IRepositorioProdutoSanitario.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export interface DadosAtualizarProdutoSanitario {
  nome?: string;
  carenciaDias?: number;
}

export class AtualizarProdutoSanitario {
  constructor(private readonly repositorio: IRepositorioProdutoSanitario) {}

  async executar(id: string, dados: DadosAtualizarProdutoSanitario): Promise<ProdutoSanitario> {
    const produto = await this.repositorio.buscarPorId(id);
    if (!produto) {
      throw new ErroDeDominio('Produto sanitário não encontrado.');
    }
    produto.atualizar(dados);
    return this.repositorio.atualizar(produto);
  }
}
