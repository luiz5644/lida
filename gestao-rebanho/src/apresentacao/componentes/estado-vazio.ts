import { escaparHtml, icone } from "./dom.js";

export interface OpcoesEstadoVazio {
  icone?: string;
  titulo: string;
  descricao?: string;
  acaoHtml?: string;
}

export function estadoVazio(opcoes: OpcoesEstadoVazio): string {
  return `
    <div class="estado-vazio">
      <span class="estado-vazio-icone">${icone(
        opcoes.icone ?? "informacao",
      )}</span>
      <strong>${escaparHtml(opcoes.titulo)}</strong>
      ${
        opcoes.descricao
          ? `<p>${escaparHtml(opcoes.descricao)}</p>`
          : ""
      }
      ${opcoes.acaoHtml ?? ""}
    </div>
  `;
}
