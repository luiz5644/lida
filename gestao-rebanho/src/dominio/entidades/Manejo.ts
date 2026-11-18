import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { TipoManejo } from "../enumeracoes/TipoManejo.js";
import { TipoOcorrenciaReproducao } from "../enumeracoes/TipoOcorrenciaReproducao.js";
import { ehDataFutura, ehDataIsoValida } from "../utilitarios/datas.js";

export interface ManejoProps {
  id: string;
  tipo: TipoManejo;
  animalId?: string;
  loteId?: string;
  data: string;
  descricao?: string;
  nomeProduto?: string;
  dataReforco?: string;
  tipoOcorrencia?: TipoOcorrenciaReproducao;
  animalRelacionadoId?: string;
}

export class Manejo {
  readonly id: string;
  readonly tipo: TipoManejo;
  animalId?: string;
  loteId?: string;
  data: string;
  descricao?: string;
  nomeProduto?: string;
  dataReforco?: string;
  tipoOcorrencia?: TipoOcorrenciaReproducao;
  animalRelacionadoId?: string;

  constructor(props: ManejoProps) {
    if (!Object.values(TipoManejo).includes(props.tipo)) {
      throw new ErroDeDominio("Tipo de manejo inválido.");
    }
    if (!ehDataIsoValida(props.data)) {
      throw new ErroDeDominio("Data do manejo inválida.");
    }
    if (ehDataFutura(props.data)) {
      throw new ErroDeDominio("A data do manejo não pode estar no futuro.");
    }
    if (
      props.dataReforco !== undefined &&
      props.dataReforco !== "" &&
      !ehDataIsoValida(props.dataReforco)
    ) {
      throw new ErroDeDominio("Data de reforço inválida.");
    }
    if (props.dataReforco && props.dataReforco < props.data) {
      throw new ErroDeDominio(
        "A data de reforço não pode ser anterior à aplicação.",
      );
    }

    if (props.tipo === TipoManejo.VACINACAO) {
      if (!props.nomeProduto?.trim()) {
        throw new ErroDeDominio("Informe a vacina aplicada.");
      }
      if (!props.animalId && !props.loteId) {
        throw new ErroDeDominio("Selecione um animal ou um lote.");
      }
    }

    if (props.tipo === TipoManejo.MEDICAMENTO) {
      if (!props.animalId) {
        throw new ErroDeDominio("Selecione um animal para o medicamento.");
      }
      if (!props.nomeProduto?.trim()) {
        throw new ErroDeDominio("Selecione o medicamento aplicado.");
      }
    }

    if (props.tipo === TipoManejo.REPRODUCAO) {
      if (!props.animalId) {
        throw new ErroDeDominio("Selecione um animal para a reprodução.");
      }
      if (!Object.values(TipoOcorrenciaReproducao).includes(
        props.tipoOcorrencia as TipoOcorrenciaReproducao,
      )) {
        throw new ErroDeDominio("Selecione o tipo de ocorrência.");
      }
    }

    if (props.tipo === TipoManejo.MORTE && !props.animalId) {
      throw new ErroDeDominio("Selecione o animal que veio a óbito.");
    }

    this.id = props.id;
    this.tipo = props.tipo;
    this.animalId = props.animalId || undefined;
    this.loteId = props.loteId || undefined;
    this.data = props.data;
    this.descricao = props.descricao?.trim() || undefined;
    this.nomeProduto = props.nomeProduto?.trim() || undefined;
    this.dataReforco = props.dataReforco || undefined;
    this.tipoOcorrencia = props.tipoOcorrencia;
    this.animalRelacionadoId = props.animalRelacionadoId || undefined;
  }

  atualizar(dados: {
    data?: string;
    descricao?: string | null;
    nomeProduto?: string | null;
    tipoOcorrencia?: TipoOcorrenciaReproducao | null;
  }): void {
    if (dados.data !== undefined) {
      if (!ehDataIsoValida(dados.data)) {
        throw new ErroDeDominio("Data do manejo inválida.");
      }
      if (ehDataFutura(dados.data)) {
        throw new ErroDeDominio("A data do manejo não pode estar no futuro.");
      }
      this.data = dados.data;
    }
    if (dados.descricao !== undefined) {
      this.descricao = dados.descricao?.trim() || undefined;
    }
    if (dados.nomeProduto !== undefined) {
      this.nomeProduto = dados.nomeProduto?.trim() || undefined;
    }
    if (dados.tipoOcorrencia !== undefined) {
      this.tipoOcorrencia = dados.tipoOcorrencia ?? undefined;
    }
  }

  paraJSON(): ManejoProps {
    return {
      id: this.id,
      tipo: this.tipo,
      animalId: this.animalId,
      loteId: this.loteId,
      data: this.data,
      descricao: this.descricao,
      nomeProduto: this.nomeProduto,
      dataReforco: this.dataReforco,
      tipoOcorrencia: this.tipoOcorrencia,
      animalRelacionadoId: this.animalRelacionadoId,
    };
  }

  static deJSON(props: ManejoProps): Manejo {
    return new Manejo(props);
  }
}
