import { Usuario, UsuarioProps } from '../../dominio/entidades/Usuario.js';
import { IRepositorioUsuario } from '../../dominio/repositorios/IRepositorioUsuario.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'usuarios';

export class RepositorioUsuarioSessao extends RepositorioBaseSessao implements IRepositorioUsuario {
  async criar(usuario: Usuario): Promise<Usuario> {
    const itens = this.listarTodos<UsuarioProps>(CHAVE);
    itens.push(usuario.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return usuario;
  }

  async listar(): Promise<Usuario[]> {
    return this.listarTodos<UsuarioProps>(CHAVE).map(Usuario.deJSON);
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const props = this.listarTodos<UsuarioProps>(CHAVE).find(u => u.id === id);
    return props ? Usuario.deJSON(props) : null;
  }

  async buscarPorTelefone(telefone: string): Promise<Usuario | null> {
    const telNormalizado = telefone.replace(/\D/g, '');
    const props = this.listarTodos<UsuarioProps>(CHAVE).find(
      u => u.telefone.replace(/\D/g, '') === telNormalizado,
    );
    return props ? Usuario.deJSON(props) : null;
  }

  async atualizar(usuario: Usuario): Promise<Usuario> {
    const itens = this.listarTodos<UsuarioProps>(CHAVE);
    const idx = itens.findIndex(u => u.id === usuario.id);
    if (idx !== -1) {
      itens[idx] = usuario.paraJSON();
      this.salvarTodos(CHAVE, itens);
    }
    return usuario;
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<UsuarioProps>(CHAVE).filter(u => u.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
