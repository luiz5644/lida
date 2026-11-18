import { Propriedade } from '../../../dominio/entidades/Propriedade.js';
import type { IRepositorioPropriedade } from '../../../dominio/repositorios/IRepositorioPropriedade.js';

export interface DadosCriarPropriedade {
  nome: string;
  estado: string;
  municipio: string;
  usuarioId: string;
}

export class CriarPropriedade {
  constructor(private readonly repositorio: IRepositorioPropriedade) {}

  async executar(dados: DadosCriarPropriedade): Promise<Propriedade> {
    const propriedade = new Propriedade({
      id: crypto.randomUUID(),
      nome: dados.nome,
      estado: dados.estado,
      municipio: dados.municipio,
      usuarioId: dados.usuarioId,
    });
    return this.repositorio.criar(propriedade);
  }
}
