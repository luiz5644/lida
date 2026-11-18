import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface LoteProps {
  id: string;
  nome: string;
  finalidade?: string;
  propriedadeId: string;
}

export class Lote {
  readonly id: string;
  nome: string;
  finalidade?: string;
  readonly propriedadeId: string;

  constructor(props: LoteProps) {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new ErroDeDominio("O nome do lote é obrigatório.");
    }
    if (!props.propriedadeId) {
      throw new ErroDeDominio("O lote precisa estar vinculado a uma propriedade.");
    }
    this.id = props.id;
    this.nome = props.nome.trim();
    this.finalidade = props.finalidade?.trim() || undefined;
    this.propriedadeId = props.propriedadeId;
  }

  atualizar(dados: { nome?: string; finalidade?: string | null }): void {
    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) {
        throw new ErroDeDominio("O nome do lote é obrigatório.");
      }
      this.nome = dados.nome.trim();
    }
    if (dados.finalidade !== undefined) {
      this.finalidade = dados.finalidade?.trim() || undefined;
    }
  }

  paraJSON(): LoteProps {
    return {
      id: this.id,
      nome: this.nome,
      finalidade: this.finalidade,
      propriedadeId: this.propriedadeId,
    };
  }

  static deJSON(props: LoteProps): Lote {
    return new Lote(props);
  }
}
