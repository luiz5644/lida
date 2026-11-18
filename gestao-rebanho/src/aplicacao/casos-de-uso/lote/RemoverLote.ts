import type { IRepositorioLote } from '../../../dominio/repositorios/IRepositorioLote.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverLote {
  constructor(
    private readonly repositorio: IRepositorioLote,
    private readonly repositorioAnimal: IRepositorioAnimal,
  ) {}

  async executar(id: string): Promise<void> {
    const lote = await this.repositorio.buscarPorId(id);
    if (!lote) {
      throw new ErroDeDominio('Lote não encontrado.');
    }
    const animais = await this.repositorioAnimal.listarPorLote(id);
    if (animais.length > 0) {
      throw new ErroDeDominio(
        'Remova ou mova os animais antes de excluir o lote.',
      );
    }
    await this.repositorio.remover(id);
  }
}
