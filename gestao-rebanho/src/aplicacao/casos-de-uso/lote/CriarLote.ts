import { Lote } from '../../../dominio/entidades/Lote.js';
import type { IRepositorioLote } from '../../../dominio/repositorios/IRepositorioLote.js';

export interface DadosCriarLote {
  nome: string;
  finalidade?: string;
  propriedadeId: string;
}

export class CriarLote {
  constructor(private readonly repositorio: IRepositorioLote) {}

  async executar(dados: DadosCriarLote): Promise<Lote> {
    const lote = new Lote({
      id: crypto.randomUUID(),
      nome: dados.nome,
      finalidade: dados.finalidade,
      propriedadeId: dados.propriedadeId,
    });
    return this.repositorio.criar(lote);
  }
}
