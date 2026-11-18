import { StatusAnimal } from "../../dominio/enumeracoes/StatusAnimal.js";
import { StatusPrazo } from "../../dominio/enumeracoes/StatusPrazo.js";
import { rotuloStatusAnimal, rotuloStatusPrazo, tomStatusPrazo } from "../utilitarios/formatadores.js";
import { escaparHtml } from "./dom.js";

export type TomBadge = "positivo" | "andamento" | "perigo" | "neutro";

export function badge(
  texto: string,
  tom: TomBadge = "neutro",
  comPonto = false,
): string {
  return `<span class="badge badge--${tom}">${
    comPonto ? '<span class="badge-ponto">●</span>' : ""
  }${escaparHtml(texto)}</span>`;
}

export function badgeStatusAnimal(status: StatusAnimal): string {
  switch (status) {
    case StatusAnimal.ATIVO:
      return badge(rotuloStatusAnimal(status), "positivo", true);
    case StatusAnimal.MORTO:
      return badge(rotuloStatusAnimal(status), "perigo", true);
    default:
      return badge(rotuloStatusAnimal(status), "neutro", true);
  }
}

export function badgeStatusPrazo(status: StatusPrazo): string {
  return badge(rotuloStatusPrazo(status), tomStatusPrazo(status));
}
