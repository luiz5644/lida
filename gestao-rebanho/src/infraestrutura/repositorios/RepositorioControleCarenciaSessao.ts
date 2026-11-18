import { ControleCarencia, ControleCarenciaProps } from '../../dominio/entidades/ControleCarencia.js';
import { IRepositorioControleCarencia } from '../../dominio/repositorios/IRepositorioControleCarencia.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'controles-carencia';

export class RepositorioControleCarenciaSessao extends RepositorioBaseSessao implements IRepositorioControleCarencia {
  async criar(controle: ControleCarencia): Promise<ControleCarencia> {
    const itens = this.listarTodos<ControleCarenciaProps>(CHAVE);
    itens.push(controle.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return controle;
  }

  async listar(): Promise<ControleCarencia[]> {
    return this.listarTodos<ControleCarenciaProps>(CHAVE).map(ControleCarencia.deJSON);
  }

  async listarPorAnimal(animalId: string): Promise<ControleCarencia[]> {
    return this.listarTodos<ControleCarenciaProps>(CHAVE)
      .filter(c => c.animalId === animalId)
      .map(ControleCarencia.deJSON);
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<ControleCarenciaProps>(CHAVE).filter(c => c.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
