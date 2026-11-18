import { IServicoLocalidades } from "../../../dominio/servicos/IServicoLocalidades.js";
import { ErroDeDominio } from "../../../dominio/erros/ErroDeDominio.js";

export class ListarMunicipios {
  constructor(private readonly servico: IServicoLocalidades) {}

  async executar(uf: string): Promise<string[]> {
    if (!uf || uf.trim().length !== 2) {
      throw new ErroDeDominio("Selecione um estado para listar os municípios.");
    }
    return this.servico.listarMunicipios(uf.trim().toUpperCase());
  }
}
