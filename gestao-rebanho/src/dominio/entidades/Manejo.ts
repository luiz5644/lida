import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { TipoManejo } from "../enumeracoes/TipoManejo.js";

export interface ManejoProps {
  id: string;
  animalId: string;
  tipo: TipoManejo;
  data: string;
  observacao: string;
}

export class Manejo {
  readonly id: string;
  animalId: string;
  tipo: TipoManejo;
  data: string;
  observacao: string;

  constructor(props: ManejoProps) {
    if (!props.animalId) {
      throw new ErroDeDominio("O animal é obrigatório.");
    }
    if (!Object.values(TipoManejo).includes(props.tipo)) {
      throw new ErroDeDominio("Tipo de manejo inválido.");
    }
    Manejo.validarData(props.data);
    this.id = props.id;
    this.animalId = props.animalId;
    this.tipo = props.tipo;
    this.data = props.data;
    this.observacao = (props.observacao ?? "").trim();
  }

  private static validarData(data: string): void {
    if (!data) {
      throw new ErroDeDominio("A data do manejo é obrigatória.");
    }
    const valor = new Date(`${data}T00:00:00`);
    if (Number.isNaN(valor.getTime())) {
      throw new ErroDeDominio("Data do manejo inválida.");
    }
  }

  atualizar(dados: {
    animalId?: string;
    tipo?: TipoManejo;
    data?: string;
    observacao?: string;
  }): void {
    if (dados.animalId !== undefined) {
      if (!dados.animalId) {
        throw new ErroDeDominio("O animal é obrigatório.");
      }
      this.animalId = dados.animalId;
    }
    if (dados.tipo !== undefined) {
      if (!Object.values(TipoManejo).includes(dados.tipo)) {
        throw new ErroDeDominio("Tipo de manejo inválido.");
      }
      this.tipo = dados.tipo;
    }
    if (dados.data !== undefined) {
      Manejo.validarData(dados.data);
      this.data = dados.data;
    }
    if (dados.observacao !== undefined) {
      this.observacao = dados.observacao.trim();
    }
  }

  paraJSON(): ManejoProps {
    return {
      id: this.id,
      animalId: this.animalId,
      tipo: this.tipo,
      data: this.data,
      observacao: this.observacao,
    };
  }

  static deJSON(json: ManejoProps): Manejo {
    return new Manejo(json);
  }
}
