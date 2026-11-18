import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { UndMedida } from "../enumeracoes/UndMedida.js";

export interface AlimentoProps {
  id: string;
  nome: string;
  unidadeMedida: UndMedida;
  custoUnitario: number;
}

export class Alimento {
  readonly id: string;
  nome: string;
  unidadeMedida: UndMedida;
  custoUnitario: number;

  constructor(props: AlimentoProps) {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new ErroDeDominio("O nome do alimento é obrigatório.");
    }
    if (!Object.values(UndMedida).includes(props.unidadeMedida)) {
      throw new ErroDeDominio("Unidade de medida inválida.");
    }
    if (!Number.isFinite(props.custoUnitario) || props.custoUnitario < 0) {
      throw new ErroDeDominio("O custo unitário não pode ser negativo.");
    }
    this.id = props.id;
    this.nome = props.nome.trim();
    this.unidadeMedida = props.unidadeMedida;
    this.custoUnitario = props.custoUnitario;
  }

  atualizar(dados: {
    nome?: string;
    unidadeMedida?: UndMedida;
    custoUnitario?: number;
  }): void {
    if (dados.nome !== undefined) {
      if (!dados.nome || dados.nome.trim().length === 0) {
        throw new ErroDeDominio("O nome do alimento é obrigatório.");
      }
      this.nome = dados.nome.trim();
    }
    if (dados.unidadeMedida !== undefined) {
      if (!Object.values(UndMedida).includes(dados.unidadeMedida)) {
        throw new ErroDeDominio("Unidade de medida inválida.");
      }
      this.unidadeMedida = dados.unidadeMedida;
    }
    if (dados.custoUnitario !== undefined) {
      if (!Number.isFinite(dados.custoUnitario) || dados.custoUnitario < 0) {
        throw new ErroDeDominio("O custo unitário não pode ser negativo.");
      }
      this.custoUnitario = dados.custoUnitario;
    }
  }

  paraJSON(): AlimentoProps {
    return {
      id: this.id,
      nome: this.nome,
      unidadeMedida: this.unidadeMedida,
      custoUnitario: this.custoUnitario,
    };
  }

  static deJSON(json: AlimentoProps): Alimento {
    return new Alimento(json);
  }
}
