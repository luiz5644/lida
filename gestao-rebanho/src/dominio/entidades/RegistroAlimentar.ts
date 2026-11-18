import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import { ehDataFutura, ehDataIsoValida } from "../utilitarios/datas.js";

export interface RegistroAlimentarProps {
  id: string;
  alimentoId: string;
  animalId?: string;
  data: string;
  quantidade: number;
}

export class RegistroAlimentar {
  readonly id: string;
  readonly alimentoId: string;
  readonly animalId?: string;
  data: string;
  quantidade: number;

  constructor(props: RegistroAlimentarProps) {
    if (!props.alimentoId) {
      throw new ErroDeDominio("Selecione o alimento consumido.");
    }
    if (!ehDataIsoValida(props.data)) {
      throw new ErroDeDominio("Data do consumo inválida.");
    }
    if (ehDataFutura(props.data)) {
      throw new ErroDeDominio("A data do consumo não pode estar no futuro.");
    }
    if (!Number.isFinite(props.quantidade) || props.quantidade <= 0) {
      throw new ErroDeDominio("A quantidade consumida deve ser maior que zero.");
    }
    this.id = props.id;
    this.alimentoId = props.alimentoId;
    this.animalId = props.animalId || undefined;
    this.data = props.data;
    this.quantidade = props.quantidade;
  }

  paraJSON(): RegistroAlimentarProps {
    return {
      id: this.id,
      alimentoId: this.alimentoId,
      animalId: this.animalId,
      data: this.data,
      quantidade: this.quantidade,
    };
  }

  static deJSON(props: RegistroAlimentarProps): RegistroAlimentar {
    return new RegistroAlimentar(props);
  }
}
