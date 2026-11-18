export interface ElementosAparelho {
  palco: HTMLElement;
  aparelho: HTMLElement;
  tela: HTMLElement;
  cabecalho: HTMLElement;
  conteudo: HTMLElement;
  navegacao: HTMLElement;
  flutuantes: HTMLElement;
}

export function montarAparelho(destino: HTMLElement): ElementosAparelho {
  destino.innerHTML = `
    <div class="palco">
      <div class="aparelho">
        <div class="tela" id="tela">
          <header class="cabecalho-app" id="cabecalho-app"></header>
          <main class="conteudo-app" id="conteudo-app" tabindex="-1"></main>
          <nav class="barra-navegacao" id="barra-navegacao" aria-label="Navegação principal"></nav>
          <div class="camada-flutuante" id="camada-flutuante"></div>
          <div class="toasts" id="toasts" aria-live="polite"></div>
        </div>
      </div>
    </div>
  `;

  const palco = destino.querySelector<HTMLElement>(".palco");
  const aparelho = destino.querySelector<HTMLElement>(".aparelho");
  const tela = destino.querySelector<HTMLElement>(".tela");
  const cabecalho = destino.querySelector<HTMLElement>("#cabecalho-app");
  const conteudo = destino.querySelector<HTMLElement>("#conteudo-app");
  const navegacao = destino.querySelector<HTMLElement>("#barra-navegacao");
  const flutuantes = destino.querySelector<HTMLElement>("#camada-flutuante");

  if (
    !palco ||
    !aparelho ||
    !tela ||
    !cabecalho ||
    !conteudo ||
    !navegacao ||
    !flutuantes
  ) {
    throw new Error("Não foi possível montar a estrutura do aplicativo.");
  }

  return { palco, aparelho, tela, cabecalho, conteudo, navegacao, flutuantes };
}
