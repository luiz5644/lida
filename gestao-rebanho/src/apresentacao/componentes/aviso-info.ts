import { escaparHtml, icone } from "./dom.js";

export type TipoAviso = "info" | "perigo" | "alerta";

export function avisoInfo(
  mensagem: string,
  tipo: TipoAviso = "info",
): string {
  const iconeNome = tipo === "perigo" ? "informacao" : "informacao";
  return `
    <div class="aviso aviso--${tipo}">
      ${icone(iconeNome, "icone--pequeno")}
      <p>${escaparHtml(mensagem)}</p>
    </div>
  `;
}
