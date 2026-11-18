import type { Manejo } from '../../../dominio/entidades/Manejo.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import type { TipoOcorrenciaReproducao } from '../../../dominio/enumeracoes/TipoOcorrenciaReproducao.js';

export interface DadosAtualizarManejo {
  data?: string;
  descricao?: string | null;
  nomeProduto?: string | null;
  tipoOcorrencia?: TipoOcorrenciaReproducao | null;
}

export class AtualizarManejo {
  constructor(private readonly repositorio: IRepositorioManejo) {}

  async executar(id: string, dados: DadosAtualizarManejo): Promise<Manejo> {
    const manejo = await this.repositorio.buscarPorId(id);
    if (!manejo) {
      throw new ErroDeDominio('Manejo não encontrado.');
    }
    manejo.atualizar(dados);
    return this.repositorio.atualizar(manejo);
  }
}
