import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { ehDataFutura, ehDataIsoValida } from "../utilitarios/datas.js";

export interface PesagemProps {
  id: string;
  animalId: string;
  data: string;
  pesoKg: number;
}

export class Pesagem {
  readonly id: string;
  readonly animalId: string;
  data: string;
  pesoKg: number;

  constructor(props: PesagemProps) {
    if (!props.animalId) {
      throw new ErroDeDominio("Selecione um animal para a pesagem.");
    }
    if (!ehDataIsoValida(props.data)) {
      throw new ErroDeDominio("Data da pesagem inválida.");
    }
    if (ehDataFutura(props.data)) {
      throw new ErroDeDominio("A data da pesagem não pode estar no futuro.");
    }
    if (!Number.isFinite(props.pesoKg) || props.pesoKg <= 0) {
      throw new ErroDeDominio("O peso deve ser maior que zero.");
    }
    this.id = props.id;
    this.animalId = props.animalId;
    this.data = props.data;
    this.pesoKg = props.pesoKg;
  }

  paraJSON(): PesagemProps {
    return {
      id: this.id,
      animalId: this.animalId,
      data: this.data,
      pesoKg: this.pesoKg,
    };
  }

  static deJSON(props: PesagemProps): Pesagem {
    return new Pesagem(props);
  }
}
