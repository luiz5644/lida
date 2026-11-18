import { RegistroAlimentar, RegistroAlimentarProps } from '../../dominio/entidades/RegistroAlimentar.js';
import { IRepositorioRegistroAlimentar } from '../../dominio/repositorios/IRepositorioRegistroAlimentar.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'registros-alimentares';

export class RepositorioRegistroAlimentarSessao extends RepositorioBaseSessao implements IRepositorioRegistroAlimentar {
  async criar(registro: RegistroAlimentar): Promise<RegistroAlimentar> {
    const itens = this.listarTodos<RegistroAlimentarProps>(CHAVE);
    itens.push(registro.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return registro;
  }

  async listar(): Promise<RegistroAlimentar[]> {
    return this.listarTodos<RegistroAlimentarProps>(CHAVE).map(RegistroAlimentar.deJSON);
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<RegistroAlimentarProps>(CHAVE).filter(r => r.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
