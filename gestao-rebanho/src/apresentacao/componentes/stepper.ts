import { escaparHtml } from "./dom.js";

const ROTULOS_PADRAO = ["Propriedade", "Rebanho", "Conclusão"];

export function stepper(
  etapaAtual: number,
  rotulos: string[] = ROTULOS_PADRAO,
): string {
  return `
    <div class="stepper">
      <div class="stepper-barras" role="progressbar" aria-valuemin="1" aria-valuemax="${rotulos.length}" aria-valuenow="${etapaAtual}">
        ${rotulos
          .map(
            (_rotulo, indice) =>
              `<span class="stepper-barra${
                indice + 1 <= etapaAtual ? " stepper-barra--ativa" : ""
              }"></span>`,
          )
          .join("")}
      </div>
      <p class="stepper-rotulo">Etapa ${etapaAtual} de ${rotulos.length} · ${escaparHtml(
        rotulos[etapaAtual - 1] ?? "",
      )}</p>
    </div>
  `;
}
