import type { IRepositorioUsuario } from '../../../dominio/repositorios/IRepositorioUsuario.js';
import type { IServicoCodigoAcesso } from '../../../dominio/servicos/IServicoCodigoAcesso.js';
import type { IRepositorioSessao } from '../../../dominio/repositorios/IRepositorioSessao.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import { QUANTIDADE_DIGITOS_CODIGO } from '../../../dominio/constantes.js';
import type { Usuario } from '../../../dominio/entidades/Usuario.js';

export class ConfirmarCodigoAcesso {
  constructor(
    private readonly repositorioUsuario: IRepositorioUsuario,
    private readonly servico: IServicoCodigoAcesso,
    private readonly sessao: IRepositorioSessao,
  ) {}

  async executar(codigo: string): Promise<Usuario> {
    const telefone = await this.sessao.obterTelefonePendente();
    if (!telefone) {
      throw new ErroDeDominio('Nenhuma sessão de autenticação pendente.');
    }
    const regexCodigo = new RegExp(`^\\d{${QUANTIDADE_DIGITOS_CODIGO}}$`);
    if (!regexCodigo.test(codigo)) {
      throw new ErroDeDominio(
        `O código deve conter exatamente ${QUANTIDADE_DIGITOS_CODIGO} dígitos numéricos.`,
      );
    }
    const valido = await this.servico.validar(telefone, codigo);
    if (!valido) {
      throw new ErroDeDominio('Código inválido ou expirado.');
    }
    const usuario = await this.repositorioUsuario.buscarPorTelefone(telefone);
    if (!usuario) {
      throw new ErroDeDominio('Usuário não encontrado.');
    }
    await this.sessao.definirUsuarioId(usuario.id);
    return usuario;
  }
}
