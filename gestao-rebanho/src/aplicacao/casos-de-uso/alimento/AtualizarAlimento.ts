import type { Alimento } from '../../../dominio/entidades/Alimento.js';
import type { IRepositorioAlimento } from '../../../dominio/repositorios/IRepositorioAlimento.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import type { UndMedida } from '../../../dominio/enumeracoes/UndMedida.js';

export interface DadosAtualizarAlimento {
  nome?: string;
  unidade?: UndMedida;
  quantidadeDisponivel?: number;
}

export class AtualizarAlimento {
  constructor(private readonly repositorio: IRepositorioAlimento) {}

  async executar(id: string, dados: DadosAtualizarAlimento): Promise<Alimento> {
    const alimento = await this.repositorio.buscarPorId(id);
    if (!alimento) {
      throw new ErroDeDominio('Alimento não encontrado.');
    }
    alimento.atualizar(dados);
    return this.repositorio.atualizar(alimento);
  }
}
