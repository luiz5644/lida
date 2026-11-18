export interface IRepositorioSessao {
  obterUsuarioId(): string | null;
  definirUsuarioId(usuarioId: string | null): void;
  obterTelefonePendente(): string | null;
  definirTelefonePendente(telefone: string | null): void;
  limpar(): void;
}
