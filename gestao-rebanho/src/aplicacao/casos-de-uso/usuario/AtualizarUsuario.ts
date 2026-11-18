import type { Usuario } from '../../../dominio/entidades/Usuario.js';
import type { IRepositorioUsuario } from '../../../dominio/repositorios/IRepositorioUsuario.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import type { EspecieAnimal } from '../../../dominio/enumeracoes/EspecieAnimal.js';
import type { SexoAnimal } from '../../../dominio/enumeracoes/SexoAnimal.js';
import type { FinalidadeAnimal } from '../../../dominio/enumeracoes/FinalidadeAnimal.js';
import type { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';

export interface DadosAtualizarUsuario {
  nome?: string;
  telefone?: string;
  email?: string | null;
}

export class AtualizarUsuario {
  constructor(private readonly repositorio: IRepositorioUsuario) {}

  async executar(id: string, dados: DadosAtualizarUsuario): Promise<Usuario> {
    const usuario = await this.repositorio.buscarPorId(id);
    if (!usuario) {
      throw new ErroDeDominio('Usuário não encontrado.');
    }
    usuario.atualizar(dados);
    return this.repositorio.atualizar(usuario);
  }
}
