import { Pesagem, PesagemProps } from '../../dominio/entidades/Pesagem.js';
import { IRepositorioPesagem } from '../../dominio/repositorios/IRepositorioPesagem.js';
import { RepositorioBaseSessao } from './RepositorioBaseSessao.js';

const CHAVE = 'pesagens';

export class RepositorioPesagemSessao extends RepositorioBaseSessao implements IRepositorioPesagem {
  async criar(pesagem: Pesagem): Promise<Pesagem> {
    const itens = this.listarTodos<PesagemProps>(CHAVE);
    itens.push(pesagem.paraJSON());
    this.salvarTodos(CHAVE, itens);
    return pesagem;
  }

  async listar(): Promise<Pesagem[]> {
    return this.listarTodos<PesagemProps>(CHAVE).map(Pesagem.deJSON);
  }

  async listarPorAnimal(animalId: string): Promise<Pesagem[]> {
    return this.listarTodos<PesagemProps>(CHAVE)
      .filter(p => p.animalId === animalId)
      .map(Pesagem.deJSON);
  }

  async remover(id: string): Promise<void> {
    const itens = this.listarTodos<PesagemProps>(CHAVE).filter(p => p.id !== id);
    this.salvarTodos(CHAVE, itens);
  }
}
