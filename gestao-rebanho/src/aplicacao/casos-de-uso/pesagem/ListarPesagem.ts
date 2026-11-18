import { Pesagem } from "../../../dominio/entidades/Pesagem.js";
import { IRepositorioPesagem } from "../../../dominio/repositorios/IRepositorioPesagem.js";

export class ListarPesagem {
  constructor(private readonly repositorio: IRepositorioPesagem) {}

  executar(): Promise<Pesagem[]> {
    return this.repositorio.listar();
  }
}
