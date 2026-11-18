import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { EspecieAnimal } from "../enumeracoes/EspecieAnimal.js";
import { FinalidadeAnimal } from "../enumeracoes/FinalidadeAnimal.js";
import { SexoAnimal } from "../enumeracoes/SexoAnimal.js";
import { StatusAnimal } from "../enumeracoes/StatusAnimal.js";
import { ehDataFutura, ehDataIsoValida } from "../utilitarios/datas.js";

export interface AnimalProps {
  id: string;
  identificacao: string;
  especie: EspecieAnimal;
  raca?: string;
  sexo: SexoAnimal;
  dataNascimento?: string;
  finalidade: FinalidadeAnimal;
  status: StatusAnimal;
  propriedadeId: string;
  loteId?: string;
}

export class Animal {
  readonly id: string;
  identificacao: string;
  especie: EspecieAnimal;
  raca?: string;
  sexo: SexoAnimal;
  dataNascimento?: string;
  finalidade: FinalidadeAnimal;
  status: StatusAnimal;
  readonly propriedadeId: string;
  loteId?: string;

  constructor(props: AnimalProps) {
    if (!props.identificacao || props.identificacao.trim().length === 0) {
      throw new ErroDeDominio("A identificação do animal é obrigatória.");
    }
    if (!Object.values(EspecieAnimal).includes(props.especie)) {
      throw new ErroDeDominio("Espécie do animal inválida.");
    }
    if (!Object.values(SexoAnimal).includes(props.sexo)) {
      throw new ErroDeDominio("Sexo do animal inválido.");
    }
    if (!Object.values(FinalidadeAnimal).includes(props.finalidade)) {
      throw new ErroDeDominio("Finalidade do animal inválida.");
    }
    if (!Object.values(StatusAnimal).includes(props.status)) {
      throw new ErroDeDominio("Status do animal inválido.");
    }
    if (!props.propriedadeId) {
      throw new ErroDeDominio("O animal precisa estar vinculado a uma propriedade.");
    }
    if (props.dataNascimento !== undefined && props.dataNascimento !== "") {
      if (!ehDataIsoValida(props.dataNascimento)) {
        throw new ErroDeDominio("Data de nascimento inválida.");
      }
      if (ehDataFutura(props.dataNascimento)) {
        throw new ErroDeDominio("A data de nascimento não pode estar no futuro.");
      }
    }

    this.id = props.id;
    this.identificacao = props.identificacao.trim();
    this.especie = props.especie;
    this.raca = props.raca?.trim() || undefined;
    this.sexo = props.sexo;
    this.dataNascimento = props.dataNascimento || undefined;
    this.finalidade = props.finalidade;
    this.status = props.status;
    this.propriedadeId = props.propriedadeId;
    this.loteId = props.loteId || undefined;
  }

  estaAtivo(): boolean {
    return this.status === StatusAnimal.ATIVO;
  }

  registrarMorte(): void {
    this.status = StatusAnimal.MORTO;
  }

  atualizar(dados: {
    identificacao?: string;
    especie?: EspecieAnimal;
    raca?: string | null;
    sexo?: SexoAnimal;
    dataNascimento?: string | null;
    finalidade?: FinalidadeAnimal;
    status?: StatusAnimal;
    loteId?: string | null;
  }): void {
    if (dados.identificacao !== undefined) {
      if (!dados.identificacao.trim()) {
        throw new ErroDeDominio("A identificação do animal é obrigatória.");
      }
      this.identificacao = dados.identificacao.trim();
    }
    if (dados.especie !== undefined) {
      if (!Object.values(EspecieAnimal).includes(dados.especie)) {
        throw new ErroDeDominio("Espécie do animal inválida.");
      }
      this.especie = dados.especie;
    }
    if (dados.raca !== undefined) {
      this.raca = dados.raca?.trim() || undefined;
    }
    if (dados.sexo !== undefined) {
      if (!Object.values(SexoAnimal).includes(dados.sexo)) {
        throw new ErroDeDominio("Sexo do animal inválido.");
      }
      this.sexo = dados.sexo;
    }
    if (dados.dataNascimento !== undefined) {
      const data = dados.dataNascimento || undefined;
      if (data) {
        if (!ehDataIsoValida(data)) {
          throw new ErroDeDominio("Data de nascimento inválida.");
        }
        if (ehDataFutura(data)) {
          throw new ErroDeDominio(
            "A data de nascimento não pode estar no futuro.",
          );
        }
      }
      this.dataNascimento = data;
    }
    if (dados.finalidade !== undefined) {
      if (!Object.values(FinalidadeAnimal).includes(dados.finalidade)) {
        throw new ErroDeDominio("Finalidade do animal inválida.");
      }
      this.finalidade = dados.finalidade;
    }
    if (dados.status !== undefined) {
      if (!Object.values(StatusAnimal).includes(dados.status)) {
        throw new ErroDeDominio("Status do animal inválido.");
      }
      this.status = dados.status;
    }
    if (dados.loteId !== undefined) {
      this.loteId = dados.loteId || undefined;
    }
  }

  paraJSON(): AnimalProps {
    return {
      id: this.id,
      identificacao: this.identificacao,
      especie: this.especie,
      raca: this.raca,
      sexo: this.sexo,
      dataNascimento: this.dataNascimento,
      finalidade: this.finalidade,
      status: this.status,
      propriedadeId: this.propriedadeId,
      loteId: this.loteId,
    };
  }

  static deJSON(props: AnimalProps): Animal {
    return new Animal(props);
  }
}
