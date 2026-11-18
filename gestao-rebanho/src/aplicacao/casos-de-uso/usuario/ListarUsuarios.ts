import type { Usuario } from '../../../dominio/entidades/Usuario.js';
import type { IRepositorioUsuario } from '../../../dominio/repositorios/IRepositorioUsuario.js';

export class ListarUsuarios {
  constructor(private readonly repositorio: IRepositorioUsuario) {}

  async executar(): Promise<Usuario[]> {
    return this.repositorio.listar();
  }
}
