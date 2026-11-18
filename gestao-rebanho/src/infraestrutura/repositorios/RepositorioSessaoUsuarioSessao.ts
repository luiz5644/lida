import { IRepositorioSessao } from '../../dominio/repositorios/IRepositorioSessao.js';

const CHAVE_USUARIO_ID = 'sessao:usuarioId';
const CHAVE_TELEFONE_PENDENTE = 'sessao:telefonePendente';

export class RepositorioSessaoUsuarioSessao implements IRepositorioSessao {
  constructor(_cliente?: any) {}
  obterUsuarioId(): string | null {
    return sessionStorage.getItem(CHAVE_USUARIO_ID);
  }

  definirUsuarioId(usuarioId: string | null): void {
    if (usuarioId === null) {
      sessionStorage.removeItem(CHAVE_USUARIO_ID);
    } else {
      sessionStorage.setItem(CHAVE_USUARIO_ID, usuarioId);
    }
  }

  obterTelefonePendente(): string | null {
    return sessionStorage.getItem(CHAVE_TELEFONE_PENDENTE);
  }

  definirTelefonePendente(telefone: string | null): void {
    if (telefone === null) {
      sessionStorage.removeItem(CHAVE_TELEFONE_PENDENTE);
    } else {
      sessionStorage.setItem(CHAVE_TELEFONE_PENDENTE, telefone);
    }
  }

  limpar(): void {
    sessionStorage.removeItem(CHAVE_USUARIO_ID);
    sessionStorage.removeItem(CHAVE_TELEFONE_PENDENTE);
  }
}
