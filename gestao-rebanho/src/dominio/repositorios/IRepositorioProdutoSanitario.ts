import { ProdutoSanitario } from "../entidades/ProdutoSanitario.js";

export interface IRepositorioProdutoSanitario {
  criar(produto: ProdutoSanitario): Promise<ProdutoSanitario>;
  listar(): Promise<ProdutoSanitario[]>;
  buscarPorId(id: string): Promise<ProdutoSanitario | null>;
  atualizar(produto: ProdutoSanitario): Promise<ProdutoSanitario>;
  remover(id: string): Promise<void>;
}
