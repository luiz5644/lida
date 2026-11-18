import type { IRepositorioControleCarencia } from '../../../dominio/repositorios/IRepositorioControleCarencia.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverControleCarencia {
  constructor(private readonly repositorio: IRepositorioControleCarencia) {}

  async executar(id: string): Promise<void> {
    const todos = await this.repositorio.listar();
    const controle = todos.find((c) => c.id === id);
    if (!controle) {
      throw new ErroDeDominio('Controle de carência não encontrado.');
    }
    await this.repositorio.remover(id);
  }
}
