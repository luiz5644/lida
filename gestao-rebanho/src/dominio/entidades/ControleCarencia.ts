import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { StatusPrazo } from "../enumeracoes/StatusPrazo.js";
import {
  adicionarDias,
  ehDataIsoValida,
  hojeIso,
} from "../utilitarios/datas.js";

export interface ControleCarenciaProps {
  id: string;
  animalId: string;
  produtoSanitarioId: string;
  dataAplicacao: string;
  dataLiberacao: string;
  observacao?: string;
}

export class ControleCarencia {
  readonly id: string;
  readonly animalId: string;
  readonly produtoSanitarioId: string;
  dataAplicacao: string;
  dataLiberacao: string;
  observacao?: string;

  constructor(props: ControleCarenciaProps) {
    if (!props.animalId) {
      throw new ErroDeDominio("Selecione um animal para o controle de carência.");
    }
    if (!props.produtoSanitarioId) {
      throw new ErroDeDominio("Selecione o produto sanitário aplicado.");
    }
    if (!ehDataIsoValida(props.dataAplicacao)) {
      throw new ErroDeDominio("Data de aplicação inválida.");
    }
    if (!ehDataIsoValida(props.dataLiberacao)) {
      throw new ErroDeDominio("Data de liberação inválida.");
    }
    if (props.dataLiberacao < props.dataAplicacao) {
      throw new ErroDeDominio(
        "A data de liberação não pode ser anterior à aplicação.",
      );
    }
    this.id = props.id;
    this.animalId = props.animalId;
    this.produtoSanitarioId = props.produtoSanitarioId;
    this.dataAplicacao = props.dataAplicacao;
    this.dataLiberacao = props.dataLiberacao;
    this.observacao = props.observacao?.trim() || undefined;
  }

  static calcularDataLiberacao(
    dataAplicacao: string,
    carenciaDias: number,
  ): string {
    if (!ehDataIsoValida(dataAplicacao)) {
      throw new ErroDeDominio("Data de aplicação inválida.");
    }
    if (!Number.isInteger(carenciaDias) || carenciaDias < 0) {
      throw new ErroDeDominio("Dias de carência inválidos.");
    }
    return adicionarDias(dataAplicacao, carenciaDias);
  }

  status(hoje: string = hojeIso()): StatusPrazo {
    return hoje < this.dataLiberacao
      ? StatusPrazo.EM_ANDAMENTO
      : StatusPrazo.LIBERADO;
  }

  paraJSON(): ControleCarenciaProps {
    return {
      id: this.id,
      animalId: this.animalId,
      produtoSanitarioId: this.produtoSanitarioId,
      dataAplicacao: this.dataAplicacao,
      dataLiberacao: this.dataLiberacao,
      observacao: this.observacao,
    };
  }

  static deJSON(props: ControleCarenciaProps): ControleCarencia {
    return new ControleCarencia(props);
  }
}
