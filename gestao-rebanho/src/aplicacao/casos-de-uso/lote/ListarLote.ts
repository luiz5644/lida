import { Lote } from "../../../dominio/entidades/Lote.js";
import { IRepositorioLote } from "../../../dominio/repositorios/IRepositorioLote.js";

export class ListarLote {
  constructor(private readonly repositorio: IRepositorioLote) {}

  executar(): Promise<Lote[]> {
    return this.repositorio.listar();
  }
}
