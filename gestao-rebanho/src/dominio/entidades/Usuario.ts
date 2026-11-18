import { ErroDeDominio } from "../erros/ErroDeDominio.js";

export interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  senha: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Usuario {
  readonly id: string;
  nome: string;
  email: string;
  senha: string;

  constructor(props: UsuarioProps) {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new ErroDeDominio("O nome do usuário é obrigatório.");
    }
    if (!props.email || !EMAIL_REGEX.test(props.email)) {
      throw new ErroDeDominio("Informe um e-mail válido.");
    }
    if (!props.senha || props.senha.length < 4) {
      throw new ErroDeDominio("A senha deve ter pelo menos 4 caracteres.");
    }
    this.id = props.id;
    this.nome = props.nome.trim();
    this.email = props.email.trim().toLowerCase();
    this.senha = props.senha;
  }

  atualizar(dados: { nome?: string; email?: string; senha?: string }): void {
    if (dados.nome !== undefined) {
      if (dados.nome.trim().length === 0) {
        throw new ErroDeDominio("O nome do usuário é obrigatório.");
      }
      this.nome = dados.nome.trim();
    }
    if (dados.email !== undefined) {
      if (!EMAIL_REGEX.test(dados.email)) {
        throw new ErroDeDominio("Informe um e-mail válido.");
      }
      this.email = dados.email.trim().toLowerCase();
    }
    if (dados.senha !== undefined) {
      if (dados.senha.length < 4) {
        throw new ErroDeDominio("A senha deve ter pelo menos 4 caracteres.");
      }
      this.senha = dados.senha;
    }
  }

  paraJSON(): UsuarioProps {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      senha: this.senha,
    };
  }

  static deJSON(json: UsuarioProps): Usuario {
    return new Usuario(json);
  }
}
