export class ClienteArmazenamentoSessao {
  constructor(readonly prefixo: string = "") {}

  ler<T>(chave: string): T | null {
    const valor = sessionStorage.getItem(chave);
    if (!valor) return null;
    try {
      return JSON.parse(valor) as T;
    } catch {
      return null;
    }
  }

  escrever<T>(chave: string, valor: T): void {
    sessionStorage.setItem(chave, JSON.stringify(valor));
  }

  remover(chave: string): void {
    sessionStorage.removeItem(chave);
  }
}
