export class CabecalhoApp {
  readonly elemento: HTMLElement;

  constructor(aoIrParaInicio: () => void) {
    this.elemento = document.createElement("div");
    this.elemento.className = "cabecalho-app-conteudo";
    this.elemento.innerHTML = `
      <button type="button" class="marca-app" aria-label="Ir para o início">
        <span class="marca-app-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#258C4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M7 20h10" />
            <path d="M12 20v-8" />
            <path d="M12 12a5 5 0 0 1 5-5c0 4.5-3 6-5 6Z" />
            <path d="M12 14a5 5 0 0 0-5-5c0 4.5 3 6 5 6Z" />
          </svg>
          lida.
        </span>
      </button>
      <span class="selo-prototipo">
        <span class="selo-prototipo-ponto"></span> Protótipo acadêmico
      </span>
    `;
    this.elemento
      .querySelector<HTMLButtonElement>(".marca-app")
      ?.addEventListener("click", aoIrParaInicio);
  }

  definirVisivel(visivel: boolean): void {
    this.elemento.hidden = !visivel;
  }
}
