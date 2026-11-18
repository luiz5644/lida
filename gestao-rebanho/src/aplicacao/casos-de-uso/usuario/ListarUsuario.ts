import { Usuario } from "../../../dominio/entidades/Usuario.js";
import { IRepositorioUsuario } from "../../../dominio/repositorios/IRepositorioUsuario.js";

export class ListarUsuario {
  constructor(private readonly repositorio: IRepositorioUsuario) {}

  executar(): Promise<Usuario[]> {
    return this.repositorio.listar();
  }
}
