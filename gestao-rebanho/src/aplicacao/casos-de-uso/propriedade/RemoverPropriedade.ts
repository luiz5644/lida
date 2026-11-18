import type { IRepositorioPropriedade } from '../../../dominio/repositorios/IRepositorioPropriedade.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class RemoverPropriedade {
  constructor(
    private readonly repositorio: IRepositorioPropriedade,
    private readonly repositorioAnimal: IRepositorioAnimal,
  ) {}

  async executar(id: string): Promise<void> {
    const propriedade = await this.repositorio.buscarPorId(id);
    if (!propriedade) {
      throw new ErroDeDominio('Propriedade não encontrada.');
    }
    const animais = await this.repositorioAnimal.listarPorPropriedade(id);
    if (animais.length > 0) {
      throw new ErroDeDominio(
        'Não é possível remover uma propriedade que possui animais cadastrados.',
      );
    }
    await this.repositorio.remover(id);
  }
}
