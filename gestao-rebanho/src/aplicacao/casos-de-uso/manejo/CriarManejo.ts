import { Manejo } from '../../../dominio/entidades/Manejo.js';
import type { ManejoProps } from '../../../dominio/entidades/Manejo.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import type { TipoManejo } from '../../../dominio/enumeracoes/TipoManejo.js';
import type { TipoOcorrenciaReproducao } from '../../../dominio/enumeracoes/TipoOcorrenciaReproducao.js';

export interface DadosCriarManejo {
  tipo: TipoManejo;
  animalId?: string;
  loteId?: string;
  data: string;
  descricao?: string;
  nomeProduto?: string;
  dataReforco?: string;
  tipoOcorrencia?: TipoOcorrenciaReproducao;
  animalRelacionadoId?: string;
}

export class CriarManejo {
  constructor(private readonly repositorio: IRepositorioManejo) {}

  async executar(dados: DadosCriarManejo): Promise<Manejo> {
    const manejo = new Manejo({
      id: crypto.randomUUID(),
      ...dados,
    });
    return this.repositorio.criar(manejo);
  }
}
