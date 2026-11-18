import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { UndMedida } from "../enumeracoes/UndMedida.js";

export interface AlimentoProps {
  id: string;
  nome: string;
  unidade: UndMedida;
  quantidadeDisponivel: number;
}

export class Alimento {
  readonly id: string;
  nome: string;
  unidade: UndMedida;
  quantidadeDisponivel: number;

  constructor(props: AlimentoProps) {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new ErroDeDominio("O nome do alimento é obrigatório.");
    }
    if (!Object.values(UndMedida).includes(props.unidade)) {
      throw new ErroDeDominio("Unidade de medida inválida.");
    }
    if (
      !Number.isFinite(props.quantidadeDisponivel) ||
      props.quantidadeDisponivel < 0
    ) {
      throw new ErroDeDominio("A quantidade disponível não pode ser negativa.");
    }

    this.id = props.id;
    this.nome = props.nome.trim();
    this.unidade = props.unidade;
    this.quantidadeDisponivel = props.quantidadeDisponivel;
  }

  consumir(quantidade: number): void {
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      throw new ErroDeDominio("A quantidade consumida deve ser maior que zero.");
    }
    if (quantidade > this.quantidadeDisponivel) {
      throw new ErroDeDominio(
        "A quantidade consumida é maior que o disponível em estoque.",
      );
    }
    this.quantidadeDisponivel =
      Math.round((this.quantidadeDisponivel - quantidade) * 1000) / 1000;
  }

  atualizar(dados: {
    nome?: string;
    unidade?: UndMedida;
    quantidadeDisponivel?: number;
  }): void {
    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) {
        throw new ErroDeDominio("O nome do alimento é obrigatório.");
      }
      this.nome = dados.nome.trim();
    }
    if (dados.unidade !== undefined) {
      if (!Object.values(UndMedida).includes(dados.unidade)) {
        throw new ErroDeDominio("Unidade de medida inválida.");
      }
      this.unidade = dados.unidade;
    }
    if (dados.quantidadeDisponivel !== undefined) {
      if (
        !Number.isFinite(dados.quantidadeDisponivel) ||
        dados.quantidadeDisponivel < 0
      ) {
        throw new ErroDeDominio(
          "A quantidade disponível não pode ser negativa.",
        );
      }
      this.quantidadeDisponivel = dados.quantidadeDisponivel;
    }
  }

  paraJSON(): AlimentoProps {
    return {
      id: this.id,
      nome: this.nome,
      unidade: this.unidade,
      quantidadeDisponivel: this.quantidadeDisponivel,
    };
  }

  static deJSON(props: AlimentoProps): Alimento {
    return new Alimento(props);
  }
}
