import { Alimento } from '../../../dominio/entidades/Alimento.js';
import type { IRepositorioAlimento } from '../../../dominio/repositorios/IRepositorioAlimento.js';
import type { UndMedida } from '../../../dominio/enumeracoes/UndMedida.js';

export interface DadosCriarAlimento {
  nome: string;
  unidade: UndMedida;
  quantidadeDisponivel: number;
}

export class CriarAlimento {
  constructor(private readonly repositorio: IRepositorioAlimento) {}

  async executar(dados: DadosCriarAlimento): Promise<Alimento> {
    const alimento = new Alimento({
      id: crypto.randomUUID(),
      nome: dados.nome,
      unidade: dados.unidade,
      quantidadeDisponivel: dados.quantidadeDisponivel,
    });
    return this.repositorio.criar(alimento);
  }
}
