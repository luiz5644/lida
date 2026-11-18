import { Estado, IServicoLocalidades } from "../../../dominio/servicos/IServicoLocalidades.js";

export class ListarEstados {
  constructor(private readonly servico: IServicoLocalidades) {}

  executar(): Promise<Estado[]> {
    return this.servico.listarEstados();
  }
}
