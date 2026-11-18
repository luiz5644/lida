import { escaparHtml } from "./dom.js";

export interface OpcaoSegmentada {
  valor: string;
  texto: string;
}

export function seletorSegmentado(
  opcoes: OpcaoSegmentada[],
  ativo: string,
  id = "seletor",
): string {
  return `
    <div class="seletor-segmentado" id="${escaparHtml(id)}" role="group">
      ${opcoes
        .map(
          (opcao) => `
            <button
              type="button"
              class="seletor-opcao${
                opcao.valor === ativo ? " seletor-opcao--ativo" : ""
              }"
              data-valor="${escaparHtml(opcao.valor)}"
              aria-pressed="${opcao.valor === ativo ? "true" : "false"}"
            >${escaparHtml(opcao.texto)}</button>
          `,
        )
        .join("")}
    </div>
  `;
}

export function ligarSeletorSegmentado(
  raiz: ParentNode,
  aoMudar: (valor: string) => void,
): void {
  const botoes = Array.from(
    raiz.querySelectorAll<HTMLButtonElement>(".seletor-opcao"),
  );
  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoes.forEach((outro) => {
        const ativo = outro === botao;
        outro.classList.toggle("seletor-opcao--ativo", ativo);
        outro.setAttribute("aria-pressed", ativo ? "true" : "false");
      });
      aoMudar(botao.dataset.valor ?? "");
    });
  });
}
