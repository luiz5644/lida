import { Usuario } from "../../../dominio/entidades/Usuario.js";
import { ErroDeDominio } from "../../../dominio/erros/ErroDeDominio.js";
import { IRepositorioSessao } from "../../../dominio/repositorios/IRepositorioSessao.js";
import { IRepositorioUsuario } from "../../../dominio/repositorios/IRepositorioUsuario.js";

export class IniciarSessaoUsuario {
  constructor(
    private readonly usuarios: IRepositorioUsuario,
    private readonly sessao: IRepositorioSessao,
  ) {}

  async executar(usuarioId: string): Promise<Usuario> {
    const usuario = await this.usuarios.buscarPorId(usuarioId);
    if (!usuario) {
      throw new ErroDeDominio("Usuário não encontrado.");
    }
    this.sessao.definirUsuarioId(usuario.id);
    return usuario;
  }
}
