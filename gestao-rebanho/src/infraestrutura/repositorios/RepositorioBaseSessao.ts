import { ClienteArmazenamentoSessao } from '../armazenamento/ClienteArmazenamentoSessao.js';

export abstract class RepositorioBaseSessao {
  protected readonly cliente: ClienteArmazenamentoSessao;

  constructor(cliente?: ClienteArmazenamentoSessao) {
    this.cliente = cliente ?? new ClienteArmazenamentoSessao();
  }

  protected listarTodos<T>(chave: string): T[] {
    return this.cliente.ler<T[]>(chave) ?? [];
  }

  protected salvarTodos<T>(chave: string, itens: T[]): void {
    this.cliente.escrever<T[]>(chave, itens);
  }
}
