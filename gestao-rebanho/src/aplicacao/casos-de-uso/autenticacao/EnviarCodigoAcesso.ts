import type { IRepositorioUsuario } from '../../../dominio/repositorios/IRepositorioUsuario.js';
import type { IServicoCodigoAcesso } from '../../../dominio/servicos/IServicoCodigoAcesso.js';
import type { IRepositorioSessao } from '../../../dominio/repositorios/IRepositorioSessao.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class EnviarCodigoAcesso {
  constructor(
    private readonly repositorioUsuario: IRepositorioUsuario,
    private readonly servico: IServicoCodigoAcesso,
    private readonly sessao: IRepositorioSessao,
  ) {}

  async executar(telefone: string): Promise<void> {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    const usuario = await this.repositorioUsuario.buscarPorTelefone(telefoneLimpo);
    if (!usuario) {
      throw new ErroDeDominio('Usuário não encontrado. Crie sua conta primeiro.');
    }
    await this.servico.enviar(telefoneLimpo);
    await this.sessao.definirTelefonePendente(telefoneLimpo);
  }
}
