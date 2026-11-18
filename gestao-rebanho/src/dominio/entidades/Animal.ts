import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { SexoAnimal } from "../enumeracoes/SexoAnimal.js";
import { StatusAnimal } from "../enumeracoes/StatusAnimal.js";

export interface AnimalProps {
  id: string;
  brinco: string;
  nome: string;
  raca: string;
  sexo: SexoAnimal;
  dataNascimento: string;
  status: StatusAnimal;
  propriedadeId: string;
}

export class Animal {
  readonly id: string;
  brinco: string;
  nome: string;
  raca: string;
  sexo: SexoAnimal;
  dataNascimento: string;
  status: StatusAnimal;
  propriedadeId: string;

  constructor(props: AnimalProps) {
    Animal.validarBrinco(props.brinco);
    if (!props.propriedadeId) {
      throw new ErroDeDominio("A propriedade do animal é obrigatória.");
    }
    if (!Object.values(SexoAnimal).includes(props.sexo)) {
      throw new ErroDeDominio("Sexo do animal inválido.");
    }
    if (!Object.values(StatusAnimal).includes(props.status)) {
      throw new ErroDeDominio("Status do animal inválido.");
    }
    Animal.validarDataNascimento(props.dataNascimento);
    this.id = props.id;
    this.brinco = props.brinco.trim();
    this.nome = (props.nome ?? "").trim();
    this.raca = (props.raca ?? "").trim();
    this.sexo = props.sexo;
    this.dataNascimento = props.dataNascimento;
    this.status = props.status;
    this.propriedadeId = props.propriedadeId;
  }

  private static validarBrinco(brinco: string): void {
    if (!brinco || brinco.trim().length === 0) {
      throw new ErroDeDominio("O brinco do animal é obrigatório.");
    }
  }

  private static validarDataNascimento(data: string): void {
    if (!data) {
      throw new ErroDeDominio("A data de nascimento é obrigatória.");
    }
    const nascimento = new Date(`${data}T00:00:00`);
    if (Number.isNaN(nascimento.getTime())) {
      throw new ErroDeDominio("Data de nascimento inválida.");
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (nascimento.getTime() > hoje.getTime()) {
      throw new ErroDeDominio("A data de nascimento não pode estar no futuro.");
    }
  }

  atualizar(dados: {
    brinco?: string;
    nome?: string;
    raca?: string;
    sexo?: SexoAnimal;
    dataNascimento?: string;
    status?: StatusAnimal;
    propriedadeId?: string;
  }): void {
    if (dados.brinco !== undefined) {
      Animal.validarBrinco(dados.brinco);
      this.brinco = dados.brinco.trim();
    }
    if (dados.nome !== undefined) {
      this.nome = dados.nome.trim();
    }
    if (dados.raca !== undefined) {
      this.raca = dados.raca.trim();
    }
    if (dados.sexo !== undefined) {
      if (!Object.values(SexoAnimal).includes(dados.sexo)) {
        throw new ErroDeDominio("Sexo do animal inválido.");
      }
      this.sexo = dados.sexo;
    }
    if (dados.dataNascimento !== undefined) {
      Animal.validarDataNascimento(dados.dataNascimento);
      this.dataNascimento = dados.dataNascimento;
    }
    if (dados.status !== undefined) {
      if (!Object.values(StatusAnimal).includes(dados.status)) {
        throw new ErroDeDominio("Status do animal inválido.");
      }
      this.status = dados.status;
    }
    if (dados.propriedadeId !== undefined) {
      if (!dados.propriedadeId) {
        throw new ErroDeDominio("A propriedade do animal é obrigatória.");
      }
      this.propriedadeId = dados.propriedadeId;
    }
  }

  paraJSON(): AnimalProps {
    return {
      id: this.id,
      brinco: this.brinco,
      nome: this.nome,
      raca: this.raca,
      sexo: this.sexo,
      dataNascimento: this.dataNascimento,
      status: this.status,
      propriedadeId: this.propriedadeId,
    };
  }

  static deJSON(json: AnimalProps): Animal {
    return new Animal(json);
  }
}
