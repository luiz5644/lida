export interface ContextoTela {
  conteudo: HTMLElement;
  flutuantes: HTMLElement;
  navegar: (caminho: string) => void;
  recarregar: () => void;
}

export function montarNaTela(
  tela: ContextoTela,
  elemento: HTMLElement,
): void {
  tela.conteudo.replaceChildren(elemento);
  tela.conteudo.scrollTop = 0;
}
