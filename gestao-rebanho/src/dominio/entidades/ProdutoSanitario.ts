import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface ProdutoSanitarioProps {
  id: string;
  nome: string;
  tipo: string;
  carenciaDias: number;
}

export class ProdutoSanitario {
  readonly id: string;
  nome: string;
  tipo: string;
  carenciaDias: number;

  constructor(props: ProdutoSanitarioProps) {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new ErroDeDominio("O nome do produto sanitário é obrigatório.");
    }
    if (!props.tipo || props.tipo.trim().length === 0) {
      throw new ErroDeDominio("O tipo do produto sanitário é obrigatório.");
    }
    ProdutoSanitario.validarCarencia(props.carenciaDias);
    this.id = props.id;
    this.nome = props.nome.trim();
    this.tipo = props.tipo.trim();
    this.carenciaDias = props.carenciaDias;
  }

  private static validarCarencia(dias: number): void {
    if (!Number.isInteger(dias) || dias < 0) {
      throw new ErroDeDominio("Os dias de carência devem ser um número inteiro maior ou igual a zero.");
    }
  }

  atualizar(dados: {
    nome?: string;
    tipo?: string;
    carenciaDias?: number;
  }): void {
    if (dados.nome !== undefined) {
      if (!dados.nome || dados.nome.trim().length === 0) {
        throw new ErroDeDominio("O nome do produto sanitário é obrigatório.");
      }
      this.nome = dados.nome.trim();
    }
    if (dados.tipo !== undefined) {
      if (!dados.tipo || dados.tipo.trim().length === 0) {
        throw new ErroDeDominio("O tipo do produto sanitário é obrigatório.");
      }
      this.tipo = dados.tipo.trim();
    }
    if (dados.carenciaDias !== undefined) {
      ProdutoSanitario.validarCarencia(dados.carenciaDias);
      this.carenciaDias = dados.carenciaDias;
    }
  }

  paraJSON(): ProdutoSanitarioProps {
    return {
      id: this.id,
      nome: this.nome,
      tipo: this.tipo,
      carenciaDias: this.carenciaDias,
    };
  }

  static deJSON(json: ProdutoSanitarioProps): ProdutoSanitario {
    return new ProdutoSanitario(json);
  }
}
