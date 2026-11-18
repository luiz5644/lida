import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { StatusCarencia } from "../enumeracoes/StatusCarencia.js";

export interface ControleCarenciaProps {
  id: string;
  animalId: string;
  produtoSanitarioId: string;
  dataAplicacao: string;
  dataLiberacao: string;
}

export interface ControleCarenciaJSON extends ControleCarenciaProps {
  status: StatusCarencia;
}

export class ControleCarencia {
  readonly id: string;
  animalId: string;
  produtoSanitarioId: string;
  dataAplicacao: string;
  dataLiberacao: string;
  status: StatusCarencia;

  constructor(props: ControleCarenciaProps) {
    if (!props.animalId) {
      throw new ErroDeDominio("O animal é obrigatório.");
    }
    if (!props.produtoSanitarioId) {
      throw new ErroDeDominio("O produto sanitário é obrigatório.");
    }
    ControleCarencia.validarData(props.dataAplicacao, "Data de aplicação");
    ControleCarencia.validarData(props.dataLiberacao, "Data de liberação");
    this.id = props.id;
    this.animalId = props.animalId;
    this.produtoSanitarioId = props.produtoSanitarioId;
    this.dataAplicacao = props.dataAplicacao;
    this.dataLiberacao = props.dataLiberacao;
    this.status = ControleCarencia.calcularStatus(props.dataLiberacao);
  }

  private static validarData(data: string, rotulo: string): void {
    if (!data) {
      throw new ErroDeDominio(`${rotulo} é obrigatória.`);
    }
    const valor = new Date(`${data}T00:00:00`);
    if (Number.isNaN(valor.getTime())) {
      throw new ErroDeDominio(`${rotulo} inválida.`);
    }
  }

  static calcularDataLiberacao(dataAplicacao: string, carenciaDias: number): string {
    const data = new Date(`${dataAplicacao}T00:00:00`);
    if (Number.isNaN(data.getTime())) {
      throw new ErroDeDominio("Data de aplicação inválida.");
    }
    if (!Number.isInteger(carenciaDias) || carenciaDias < 0) {
      throw new ErroDeDominio("Os dias de carência devem ser um número inteiro maior ou igual a zero.");
    }
    data.setDate(data.getDate() + carenciaDias);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  static calcularStatus(dataLiberacao: string): StatusCarencia {
    const liberacao = new Date(`${dataLiberacao}T00:00:00`);
    if (Number.isNaN(liberacao.getTime())) {
      throw new ErroDeDominio("Data de liberação inválida.");
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return liberacao.getTime() > hoje.getTime()
      ? StatusCarencia.EM_CARENCIA
      : StatusCarencia.LIBERADO;
  }

  atualizarStatus(): void {
    this.status = ControleCarencia.calcularStatus(this.dataLiberacao);
  }

  atualizar(dados: {
    produtoSanitarioId?: string;
    dataAplicacao?: string;
    dataLiberacao?: string;
  }): void {
    if (dados.produtoSanitarioId !== undefined) {
      if (!dados.produtoSanitarioId) {
        throw new ErroDeDominio("O produto sanitário é obrigatório.");
      }
      this.produtoSanitarioId = dados.produtoSanitarioId;
    }
    if (dados.dataAplicacao !== undefined) {
      ControleCarencia.validarData(dados.dataAplicacao, "Data de aplicação");
      this.dataAplicacao = dados.dataAplicacao;
    }
    if (dados.dataLiberacao !== undefined) {
      ControleCarencia.validarData(dados.dataLiberacao, "Data de liberação");
      this.dataLiberacao = dados.dataLiberacao;
    }
    this.atualizarStatus();
  }

  paraJSON(): ControleCarenciaJSON {
    return {
      id: this.id,
      animalId: this.animalId,
      produtoSanitarioId: this.produtoSanitarioId,
      dataAplicacao: this.dataAplicacao,
      dataLiberacao: this.dataLiberacao,
      status: this.status,
    };
  }

  static deJSON(json: ControleCarenciaJSON): ControleCarencia {
    return new ControleCarencia({
      id: json.id,
      animalId: json.animalId,
      produtoSanitarioId: json.produtoSanitarioId,
      dataAplicacao: json.dataAplicacao,
      dataLiberacao: json.dataLiberacao,
    });
  }
}
