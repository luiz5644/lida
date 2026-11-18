import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface RegistroAlimentarProps {
  id: string;
  animalId: string;
  alimentoId: string;
  quantidade: number;
  data: string;
}

export class RegistroAlimentar {
  readonly id: string;
  animalId: string;
  alimentoId: string;
  quantidade: number;
  data: string;

  constructor(props: RegistroAlimentarProps) {
    if (!props.animalId) {
      throw new ErroDeDominio("O animal é obrigatório.");
    }
    if (!props.alimentoId) {
      throw new ErroDeDominio("O alimento é obrigatório.");
    }
    RegistroAlimentar.validarQuantidade(props.quantidade);
    RegistroAlimentar.validarData(props.data);
    this.id = props.id;
    this.animalId = props.animalId;
    this.alimentoId = props.alimentoId;
    this.quantidade = props.quantidade;
    this.data = props.data;
  }

  private static validarQuantidade(quantidade: number): void {
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      throw new ErroDeDominio("A quantidade deve ser maior que zero.");
    }
  }

  private static validarData(data: string): void {
    if (!data) {
      throw new ErroDeDominio("A data do registro alimentar é obrigatória.");
    }
    const valor = new Date(`${data}T00:00:00`);
    if (Number.isNaN(valor.getTime())) {
      throw new ErroDeDominio("Data do registro alimentar inválida.");
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (valor.getTime() > hoje.getTime()) {
      throw new ErroDeDominio("A data do registro alimentar não pode estar no futuro.");
    }
  }

  atualizar(dados: {
    animalId?: string;
    alimentoId?: string;
    quantidade?: number;
    data?: string;
  }): void {
    if (dados.animalId !== undefined) {
      if (!dados.animalId) {
        throw new ErroDeDominio("O animal é obrigatório.");
      }
      this.animalId = dados.animalId;
    }
    if (dados.alimentoId !== undefined) {
      if (!dados.alimentoId) {
        throw new ErroDeDominio("O alimento é obrigatório.");
      }
      this.alimentoId = dados.alimentoId;
    }
    if (dados.quantidade !== undefined) {
      RegistroAlimentar.validarQuantidade(dados.quantidade);
      this.quantidade = dados.quantidade;
    }
    if (dados.data !== undefined) {
      RegistroAlimentar.validarData(dados.data);
      this.data = dados.data;
    }
  }

  paraJSON(): RegistroAlimentarProps {
    return {
      id: this.id,
      animalId: this.animalId,
      alimentoId: this.alimentoId,
      quantidade: this.quantidade,
      data: this.data,
    };
  }

  static deJSON(json: RegistroAlimentarProps): RegistroAlimentar {
    return new RegistroAlimentar(json);
  }
}
