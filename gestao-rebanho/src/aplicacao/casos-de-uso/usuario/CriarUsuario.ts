import { Usuario } from '../../../dominio/entidades/Usuario.js';
import type { IRepositorioUsuario } from '../../../dominio/repositorios/IRepositorioUsuario.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export interface DadosCriarUsuario {
  nome: string;
  telefone: string;
  email?: string;
  aceitouTermos: boolean;
}

export class CriarUsuario {
  constructor(private readonly repositorio: IRepositorioUsuario) {}

  async executar(dados: DadosCriarUsuario): Promise<Usuario> {
    const telefoneLimpo = dados.telefone.replace(/\D/g, '');
    const existente = await this.repositorio.buscarPorTelefone(telefoneLimpo);
    if (existente) {
      throw new ErroDeDominio('Já existe um usuário com este telefone.');
    }
    const usuario = new Usuario({
      id: crypto.randomUUID(),
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email,
      aceitouTermos: dados.aceitouTermos,
    });
    return this.repositorio.criar(usuario);
  }
}
