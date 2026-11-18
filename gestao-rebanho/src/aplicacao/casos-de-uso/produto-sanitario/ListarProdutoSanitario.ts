import { ProdutoSanitario } from "../../../dominio/entidades/ProdutoSanitario.js";
import { IRepositorioProdutoSanitario } from "../../../dominio/repositorios/IRepositorioProdutoSanitario.js";

export class ListarProdutoSanitario {
  constructor(private readonly repositorio: IRepositorioProdutoSanitario) {}

  executar(): Promise<ProdutoSanitario[]> {
    return this.repositorio.listar();
  }
}
