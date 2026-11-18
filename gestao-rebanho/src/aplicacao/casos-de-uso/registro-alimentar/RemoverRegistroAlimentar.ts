import type { IRepositorioRegistroAlimentar } from '../../../dominio/repositorios/IRepositorioRegistroAlimentar.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverRegistroAlimentar {
  constructor(private readonly repositorio: IRepositorioRegistroAlimentar) {}

  async executar(id: string): Promise<void> {
    const todos = await this.repositorio.listar();
    const registro = todos.find((r) => r.id === id);
    if (!registro) {
      throw new ErroDeDominio('Registro alimentar não encontrado.');
    }
    await this.repositorio.remover(id);
  }
}
