import type { IRepositorioPesagem } from '../../../dominio/repositorios/IRepositorioPesagem.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverPesagem {
  constructor(private readonly repositorio: IRepositorioPesagem) {}

  async executar(id: string): Promise<void> {
    const todas = await this.repositorio.listar();
    const pesagem = todas.find((p) => p.id === id);
    if (!pesagem) {
      throw new ErroDeDominio('Pesagem não encontrada.');
    }
    await this.repositorio.remover(id);
  }
}
