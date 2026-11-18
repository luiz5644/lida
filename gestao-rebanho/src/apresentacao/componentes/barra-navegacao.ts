import { consultarTodos, icone } from "./dom.js";

export type RotaNavegacao = "inicio" | "rebanho" | "manejos" | "prazos";

interface ItemNavegacao {
  rota: RotaNavegacao;
  rotulo: string;
  icone: string;
}

const ITENS: ItemNavegacao[] = [
  { rota: "inicio", rotulo: "Início", icone: "casa" },
  { rota: "rebanho", rotulo: "Rebanho", icone: "vaca" },
  { rota: "manejos", rotulo: "Manejos", icone: "prancheta" },
  { rota: "prazos", rotulo: "Prazos", icone: "calendario" },
];

export class BarraNavegacao {
  readonly elemento: HTMLElement;

  constructor(aoNavegar: (rota: RotaNavegacao) => void) {
    this.elemento = document.createElement("div");
    this.elemento.className = "barra-navegacao-conteudo";
    this.elemento.setAttribute("role", "navigation");
    this.elemento.setAttribute("aria-label", "Navegação principal");
    this.elemento.innerHTML = ITENS.map(
      (item) => `
        <button
          type="button"
          class="aba-navegacao"
          data-rota="${item.rota}"
          aria-label="${item.rotulo}"
        >
          <span class="aba-navegacao-pilula">${icone(item.icone)}</span>
          <span class="aba-navegacao-rotulo">${item.rotulo}</span>
        </button>
      `,
    ).join("");

    consultarTodos<HTMLButtonElement>(
      this.elemento,
      ".aba-navegacao",
    ).forEach((botao) => {
      botao.addEventListener("click", () => {
        aoNavegar((botao.dataset.rota as RotaNavegacao) ?? "inicio");
      });
    });
  }

  definirAtivo(rota: RotaNavegacao | null): void {
    consultarTodos<HTMLButtonElement>(
      this.elemento,
      ".aba-navegacao",
    ).forEach((botao) => {
      const ativo = rota !== null && botao.dataset.rota === rota;
      botao.classList.toggle("aba-navegacao--ativa", ativo);
      botao.setAttribute("aria-current", ativo ? "page" : "false");
    });
  }

  definirVisivel(visivel: boolean): void {
    this.elemento.hidden = !visivel;
  }
}
