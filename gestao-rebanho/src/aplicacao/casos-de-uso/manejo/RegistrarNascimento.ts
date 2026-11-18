import { Manejo } from '../../../dominio/entidades/Manejo.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import { TipoManejo } from '../../../dominio/enumeracoes/TipoManejo.js';
import { ehDataFutura } from '../../../dominio/utilitarios/datas.js';

export interface DadosRegistrarNascimento {
  animalRelacionadoId?: string;
  dataNascimento: string;
  descricao?: string;
}

export class RegistrarNascimento {
  constructor(private readonly repositorioManejo: IRepositorioManejo) {}

  async executar(dados: DadosRegistrarNascimento): Promise<Manejo> {
    if (ehDataFutura(dados.dataNascimento)) {
      throw new ErroDeDominio('A data de nascimento não pode estar no futuro.');
    }
    const manejo = new Manejo({
      id: crypto.randomUUID(),
      tipo: TipoManejo.NASCIMENTO,
      data: dados.dataNascimento,
      animalRelacionadoId: dados.animalRelacionadoId,
      descricao: dados.descricao,
    });
    return this.repositorioManejo.criar(manejo);
  }
}
