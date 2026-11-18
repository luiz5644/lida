import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface PropriedadeProps {
  id: string;
  nome: string;
  estado: string;
  municipio: string;
  usuarioId: string;
}

export class Propriedade {
  readonly id: string;
  nome: string;
  estado: string;
  municipio: string;
  readonly usuarioId: string;

  constructor(props: PropriedadeProps) {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new ErroDeDominio("O nome da propriedade é obrigatório.");
    }
    const estado = props.estado?.trim().toUpperCase() ?? "";
    if (estado.length !== 2) {
      throw new ErroDeDominio("Selecione um estado válido.");
    }
    if (!props.municipio || props.municipio.trim().length === 0) {
      throw new ErroDeDominio("Selecione um município válido.");
    }
    if (!props.usuarioId) {
      throw new ErroDeDominio("A propriedade precisa estar vinculada a um usuário.");
    }

    this.id = props.id;
    this.nome = props.nome.trim();
    this.estado = estado;
    this.municipio = props.municipio.trim();
    this.usuarioId = props.usuarioId;
  }

  atualizar(dados: { nome?: string; estado?: string; municipio?: string }): void {
    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) {
        throw new ErroDeDominio("O nome da propriedade é obrigatório.");
      }
      this.nome = dados.nome.trim();
    }
    if (dados.estado !== undefined) {
      const estado = dados.estado.trim().toUpperCase();
      if (estado.length !== 2) {
        throw new ErroDeDominio("Selecione um estado válido.");
      }
      this.estado = estado;
    }
    if (dados.municipio !== undefined) {
      if (!dados.municipio.trim()) {
        throw new ErroDeDominio("Selecione um município válido.");
      }
      this.municipio = dados.municipio.trim();
    }
  }

  paraJSON(): PropriedadeProps {
    return {
      id: this.id,
      nome: this.nome,
      estado: this.estado,
      municipio: this.municipio,
      usuarioId: this.usuarioId,
    };
  }

  static deJSON(props: PropriedadeProps): Propriedade {
    return new Propriedade(props);
  }
}
