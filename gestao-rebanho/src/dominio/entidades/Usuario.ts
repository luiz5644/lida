import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface UsuarioProps {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  aceitouTermos: boolean;
}

function normalizarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

function normalizarEmail(email?: string): string | undefined {
  const limpo = email?.trim().toLowerCase();
  return limpo ? limpo : undefined;
}

export class Usuario {
  readonly id: string;
  nome: string;
  telefone: string;
  email?: string;
  aceitouTermos: boolean;

  constructor(props: UsuarioProps) {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new ErroDeDominio("O nome do usuário é obrigatório.");
    }
    const telefone = normalizarTelefone(props.telefone);
    if (telefone.length < 10 || telefone.length > 11) {
      throw new ErroDeDominio("Informe um telefone válido com DDD.");
    }
    const email = normalizarEmail(props.email);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ErroDeDominio("Informe um e-mail válido.");
    }
    if (props.aceitouTermos !== true) {
      throw new ErroDeDominio(
        "É necessário aceitar os termos de uso e privacidade.",
      );
    }

    this.id = props.id;
    this.nome = props.nome.trim();
    this.telefone = telefone;
    this.email = email;
    this.aceitouTermos = true;
  }

  atualizar(dados: {
    nome?: string;
    telefone?: string;
    email?: string | null;
  }): void {
    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) {
        throw new ErroDeDominio("O nome do usuário é obrigatório.");
      }
      this.nome = dados.nome.trim();
    }
    if (dados.telefone !== undefined) {
      const telefone = normalizarTelefone(dados.telefone);
      if (telefone.length < 10 || telefone.length > 11) {
        throw new ErroDeDominio("Informe um telefone válido com DDD.");
      }
      this.telefone = telefone;
    }
    if (dados.email !== undefined) {
      const email = normalizarEmail(dados.email ?? undefined);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ErroDeDominio("Informe um e-mail válido.");
      }
      this.email = email;
    }
  }

  paraJSON(): UsuarioProps {
    return {
      id: this.id,
      nome: this.nome,
      telefone: this.telefone,
      email: this.email,
      aceitouTermos: this.aceitouTermos,
    };
  }

  static deJSON(props: UsuarioProps): Usuario {
    return new Usuario(props);
  }
}
