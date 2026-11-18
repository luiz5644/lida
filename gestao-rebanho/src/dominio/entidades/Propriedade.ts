import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface PropriedadeProps {
  id: string;
  nome: string;
  localizacao: string;
  areaTotal: number;
  usuarioId: string;
}

export class Propriedade {
  readonly id: string;
  nome: string;
  localizacao: string;
  areaTotal: number;
  usuarioId: string;

  constructor(props: PropriedadeProps) {
    Propriedade.validarNome(props.nome);
    Propriedade.validarArea(props.areaTotal);
    if (!props.usuarioId) {
      throw new ErroDeDominio("O usuário responsável é obrigatório.");
    }
    this.id = props.id;
    this.nome = props.nome.trim();
    this.localizacao = props.localizacao.trim();
    this.areaTotal = props.areaTotal;
    this.usuarioId = props.usuarioId;
  }

  private static validarNome(nome: string): void {
    if (!nome || nome.trim().length === 0) {
      throw new ErroDeDominio("O nome da propriedade é obrigatório.");
    }
  }

  private static validarArea(area: number): void {
    if (!Number.isFinite(area) || area <= 0) {
      throw new ErroDeDominio("A área total deve ser maior que zero.");
    }
  }

  atualizar(dados: {
    nome?: string;
    localizacao?: string;
    areaTotal?: number;
    usuarioId?: string;
  }): void {
    if (dados.nome !== undefined) {
      Propriedade.validarNome(dados.nome);
      this.nome = dados.nome.trim();
    }
    if (dados.localizacao !== undefined) {
      this.localizacao = dados.localizacao.trim();
    }
    if (dados.areaTotal !== undefined) {
      Propriedade.validarArea(dados.areaTotal);
      this.areaTotal = dados.areaTotal;
    }
    if (dados.usuarioId !== undefined) {
      if (!dados.usuarioId) {
        throw new ErroDeDominio("O usuário responsável é obrigatório.");
      }
      this.usuarioId = dados.usuarioId;
    }
  }

  paraJSON(): PropriedadeProps {
    return {
      id: this.id,
      nome: this.nome,
      localizacao: this.localizacao,
      areaTotal: this.areaTotal,
      usuarioId: this.usuarioId,
    };
  }

  static deJSON(json: PropriedadeProps): Propriedade {
    return new Propriedade(json);
  }
}
