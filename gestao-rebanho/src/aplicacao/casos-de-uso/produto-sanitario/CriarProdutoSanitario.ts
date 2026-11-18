import { ProdutoSanitario } from '../../../dominio/entidades/ProdutoSanitario.js';
import type { IRepositorioProdutoSanitario } from '../../../dominio/repositorios/IRepositorioProdutoSanitario.js';

export interface DadosCriarProdutoSanitario {
  nome: string;
  carenciaDias: number;
}

export class CriarProdutoSanitario {
  constructor(private readonly repositorio: IRepositorioProdutoSanitario) {}

  async executar(dados: DadosCriarProdutoSanitario): Promise<ProdutoSanitario> {
    const produto = new ProdutoSanitario({
      id: crypto.randomUUID(),
      nome: dados.nome,
      carenciaDias: dados.carenciaDias,
    });
    return this.repositorio.criar(produto);
  }
}
