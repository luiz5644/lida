import { Lote } from "../entidades/Lote.js";

export interface IRepositorioLote {
  criar(lote: Lote): Promise<Lote>;
  listar(): Promise<Lote[]>;
  listarPorPropriedade(propriedadeId: string): Promise<Lote[]>;
  buscarPorId(id: string): Promise<Lote | null>;
  atualizar(lote: Lote): Promise<Lote>;
  remover(id: string): Promise<void>;
}
