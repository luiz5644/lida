import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface PesagemProps {
  id: string;
  animalId: string;
  data: string;
  pesoKg: number;
}

export class Pesagem {
  readonly id: string;
  animalId: string;
  data: string;
  pesoKg: number;

  constructor(props: PesagemProps) {
    if (!props.animalId) {
      throw new ErroDeDominio("O animal é obrigatório.");
    }
    Pesagem.validarData(props.data);
    Pesagem.validarPeso(props.pesoKg);
    this.id = props.id;
    this.animalId = props.animalId;
    this.data = props.data;
    this.pesoKg = props.pesoKg;
  }

  private static validarData(data: string): void {
    if (!data) {
      throw new ErroDeDominio("A data da pesagem é obrigatória.");
    }
    const valor = new Date(`${data}T00:00:00`);
    if (Number.isNaN(valor.getTime())) {
      throw new ErroDeDominio("Data da pesagem inválida.");
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (valor.getTime() > hoje.getTime()) {
      throw new ErroDeDominio("A data da pesagem não pode estar no futuro.");
    }
  }

  private static validarPeso(peso: number): void {
    if (!Number.isFinite(peso) || peso <= 0) {
      throw new ErroDeDominio("O peso deve ser maior que zero.");
    }
  }

  atualizar(dados: { animalId?: string; data?: string; pesoKg?: number }): void {
    if (dados.animalId !== undefined) {
      if (!dados.animalId) {
        throw new ErroDeDominio("O animal é obrigatório.");
      }
      this.animalId = dados.animalId;
    }
    if (dados.data !== undefined) {
      Pesagem.validarData(dados.data);
      this.data = dados.data;
    }
    if (dados.pesoKg !== undefined) {
      Pesagem.validarPeso(dados.pesoKg);
      this.pesoKg = dados.pesoKg;
    }
  }

  paraJSON(): PesagemProps {
    return {
      id: this.id,
      animalId: this.animalId,
      data: this.data,
      pesoKg: this.pesoKg,
    };
  }

  static deJSON(json: PesagemProps): Pesagem {
    return new Pesagem(json);
  }
}
