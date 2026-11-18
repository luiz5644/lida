import type { IRepositorioProdutoSanitario } from '../../../dominio/repositorios/IRepositorioProdutoSanitario.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverProdutoSanitario {
  constructor(private readonly repositorio: IRepositorioProdutoSanitario) {}

  async executar(id: string): Promise<void> {
    const produto = await this.repositorio.buscarPorId(id);
    if (!produto) {
      throw new ErroDeDominio('Produto sanitário não encontrado.');
    }
    await this.repositorio.remover(id);
  }
}
