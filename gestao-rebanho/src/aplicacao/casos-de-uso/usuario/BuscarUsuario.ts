import type { Usuario } from '../../../dominio/entidades/Usuario.js';
import type { IRepositorioUsuario } from '../../../dominio/repositorios/IRepositorioUsuario.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class BuscarUsuario {
  constructor(private readonly repositorio: IRepositorioUsuario) {}

  async executar(id: string): Promise<Usuario> {
    const usuario = await this.repositorio.buscarPorId(id);
    if (!usuario) {
      throw new ErroDeDominio('Usuário não encontrado.');
    }
    return usuario;
  }
}
