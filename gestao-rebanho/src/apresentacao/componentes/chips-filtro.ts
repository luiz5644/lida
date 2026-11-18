import { consultarTodos, escaparHtml } from "./dom.js";

export interface ChipFiltro {
  valor: string;
  rotulo: string;
  contagem?: number;
}

export function chipsFiltro(chips: ChipFiltro[], ativo: string): string {
  return `
    <div class="chips-filtro" role="group" aria-label="Filtros">
      ${chips
        .map(
          (chip) => `
            <button
              type="button"
              class="chip${chip.valor === ativo ? " chip--ativo" : ""}"
              data-filtro="${escaparHtml(chip.valor)}"
              aria-pressed="${chip.valor === ativo ? "true" : "false"}"
            >
              ${escaparHtml(chip.rotulo)}${
                chip.contagem !== undefined ? ` (${chip.contagem})` : ""
              }
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

export function ligarChips(
  raiz: ParentNode,
  aoSelecionar: (valor: string) => void,
): void {
  consultarTodos<HTMLButtonElement>(raiz, "[data-filtro]").forEach((chip) => {
    chip.addEventListener("click", () => {
      aoSelecionar(chip.dataset.filtro ?? "todos");
    });
  });
}
