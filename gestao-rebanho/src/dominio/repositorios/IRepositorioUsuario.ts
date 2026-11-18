import { Usuario } from "../entidades/Usuario.js";

export interface IRepositorioUsuario {
  criar(usuario: Usuario): Promise<Usuario>;
  listar(): Promise<Usuario[]>;
  buscarPorId(id: string): Promise<Usuario | null>;
  atualizar(usuario: Usuario): Promise<Usuario>;
  remover(id: string): Promise<void>;
}
