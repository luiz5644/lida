import type { Propriedade } from '../../../dominio/entidades/Propriedade.js';
import type { IRepositorioPropriedade } from '../../../dominio/repositorios/IRepositorioPropriedade.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export interface DadosAtualizarPropriedade {
  nome?: string;
  estado?: string;
  municipio?: string;
}

export class AtualizarPropriedade {
  constructor(private readonly repositorio: IRepositorioPropriedade) {}

  async executar(id: string, dados: DadosAtualizarPropriedade): Promise<Propriedade> {
    const propriedade = await this.repositorio.buscarPorId(id);
    if (!propriedade) {
      throw new ErroDeDominio('Propriedade não encontrada.');
    }
    propriedade.atualizar(dados);
    return this.repositorio.atualizar(propriedade);
  }
}
