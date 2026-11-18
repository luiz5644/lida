import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface ProdutoSanitarioProps {
  id: string;
  nome: string;
  carenciaDias: number;
}

export class ProdutoSanitario {
  readonly id: string;
  nome: string;
  carenciaDias: number;

  constructor(props: ProdutoSanitarioProps) {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new ErroDeDominio("O nome do produto é obrigatório.");
    }
    if (
      !Number.isInteger(props.carenciaDias) ||
      props.carenciaDias < 0
    ) {
      throw new ErroDeDominio(
        "Os dias de carência devem ser um número inteiro maior ou igual a zero.",
      );
    }
    this.id = props.id;
    this.nome = props.nome.trim();
    this.carenciaDias = props.carenciaDias;
  }

  atualizar(dados: { nome?: string; carenciaDias?: number }): void {
    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) {
        throw new ErroDeDominio("O nome do produto é obrigatório.");
      }
      this.nome = dados.nome.trim();
    }
    if (dados.carenciaDias !== undefined) {
      if (!Number.isInteger(dados.carenciaDias) || dados.carenciaDias < 0) {
        throw new ErroDeDominio(
          "Os dias de carência devem ser um número inteiro maior ou igual a zero.",
        );
      }
      this.carenciaDias = dados.carenciaDias;
    }
  }

  paraJSON(): ProdutoSanitarioProps {
    return {
      id: this.id,
      nome: this.nome,
      carenciaDias: this.carenciaDias,
    };
  }

  static deJSON(props: ProdutoSanitarioProps): ProdutoSanitario {
    return new ProdutoSanitario(props);
  }
}
