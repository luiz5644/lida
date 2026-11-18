import { SexoAnimal } from "../../dominio/enumeracoes/SexoAnimal.js";
import { StatusAnimal } from "../../dominio/enumeracoes/StatusAnimal.js";
import { StatusCarencia } from "../../dominio/enumeracoes/StatusCarencia.js";
import { TipoManejo } from "../../dominio/enumeracoes/TipoManejo.js";
import { UndMedida } from "../../dominio/enumeracoes/UndMedida.js";
import { TomEtiqueta } from "../componentes/card.js";

export function formatarData(data: string): string {
  if (!data) {
    return "—";
  }
  const [ano, mes, dia] = data.split("-");
  if (!ano || !mes || !dia) {
    return data;
  }
  return `${dia}/${mes}/${ano}`;
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

export function formatarPeso(valor: number): string {
  return `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg`;
}

export function rotuloSexo(sexo: SexoAnimal): string {
  return sexo === SexoAnimal.MACHO ? "Macho" : "Fêmea";
}

export function rotuloStatusAnimal(status: StatusAnimal): string {
  switch (status) {
    case StatusAnimal.ATIVO:
      return "Ativo";
    case StatusAnimal.VENDIDO:
      return "Vendido";
    case StatusAnimal.MORTO:
      return "Morto";
    default:
      return status;
  }
}

export function tomStatusAnimal(status: StatusAnimal): TomEtiqueta {
  switch (status) {
    case StatusAnimal.ATIVO:
      return "positivo";
    case StatusAnimal.VENDIDO:
      return "neutro";
    case StatusAnimal.MORTO:
      return "perigo";
    default:
      return "neutro";
  }
}

export function rotuloTipoManejo(tipo: TipoManejo): string {
  switch (tipo) {
    case TipoManejo.VACINACAO:
      return "Vacinação";
    case TipoManejo.VERMIFUGACAO:
      return "Vermifugação";
    case TipoManejo.TRATAMENTO:
      return "Tratamento";
    case TipoManejo.REPRODUCAO:
      return "Reprodução";
    case TipoManejo.OUTRO:
      return "Outro";
    default:
      return tipo;
  }
}

export function rotuloStatusCarencia(status: StatusCarencia): string {
  return status === StatusCarencia.EM_CARENCIA ? "Em carência" : "Liberado";
}

export function tomStatusCarencia(status: StatusCarencia): TomEtiqueta {
  return status === StatusCarencia.EM_CARENCIA ? "alerta" : "positivo";
}

export function rotuloUnidade(unidade: UndMedida): string {
  switch (unidade) {
    case UndMedida.KG:
      return "kg";
    case UndMedida.G:
      return "g";
    case UndMedida.L:
      return "L";
    case UndMedida.ML:
      return "ml";
    case UndMedida.SACO:
      return "saco";
    default:
      return unidade;
  }
}

export function diasAte(dataIso: string): number {
  const alvo = new Date(`${dataIso}T00:00:00`);
  if (Number.isNaN(alvo.getTime())) {
    return 0;
  }
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diferenca = alvo.getTime() - hoje.getTime();
  return Math.round(diferenca / 86_400_000);
}
