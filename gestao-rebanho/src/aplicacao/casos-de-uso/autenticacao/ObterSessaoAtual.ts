import type { IRepositorioUsuario } from '../../../dominio/repositorios/IRepositorioUsuario.js';
import type { IRepositorioSessao } from '../../../dominio/repositorios/IRepositorioSessao.js';
import type { Usuario } from '../../../dominio/entidades/Usuario.js';

export class ObterSessaoAtual {
  constructor(
    private readonly repositorioUsuario: IRepositorioUsuario,
    private readonly sessao: IRepositorioSessao,
  ) {}

  async executar(): Promise<Usuario | null> {
    try {
      const usuarioId = await this.sessao.obterUsuarioId();
      if (!usuarioId) {
        return null;
      }
      const usuario = await this.repositorioUsuario.buscarPorId(usuarioId);
      return usuario ?? null;
    } catch {
      return null;
    }
  }
}
