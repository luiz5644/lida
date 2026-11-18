import { EspecieAnimal } from "../../dominio/enumeracoes/EspecieAnimal.js";
import { FinalidadeAnimal } from "../../dominio/enumeracoes/FinalidadeAnimal.js";
import { SexoAnimal } from "../../dominio/enumeracoes/SexoAnimal.js";
import { StatusAnimal } from "../../dominio/enumeracoes/StatusAnimal.js";
import { StatusPrazo } from "../../dominio/enumeracoes/StatusPrazo.js";
import { TipoManejo } from "../../dominio/enumeracoes/TipoManejo.js";
import { TipoOcorrenciaReproducao } from "../../dominio/enumeracoes/TipoOcorrenciaReproducao.js";
import { UndMedida } from "../../dominio/enumeracoes/UndMedida.js";

export function formatarData(dataIso: string): string {
  if (!dataIso) {
    return "—";
  }
  const [ano, mes, dia] = dataIso.split("-");
  if (!ano || !mes || !dia) {
    return dataIso;
  }
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataExtensa(data: Date = new Date()): string {
  const texto = data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function saudacao(data: Date = new Date()): string {
  const hora = data.getHours();
  if (hora < 12) {
    return "Bom dia";
  }
  if (hora < 18) {
    return "Boa tarde";
  }
  return "Boa noite";
}

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function formatarTelefone(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length === 0) {
    return "";
  }
  if (digitos.length <= 2) {
    return `(${digitos}`;
  }
  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

export function formatarPeso(valor: number): string {
  return `${formatarNumero(valor)} kg`;
}

export function formatarQuantidade(valor: number, unidade: UndMedida): string {
  return `${formatarNumero(valor)} ${rotuloUnidade(unidade)}`;
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
      return "saco(s)";
    default:
      return unidade;
  }
}

export function rotuloEspecie(especie: EspecieAnimal): string {
  switch (especie) {
    case EspecieAnimal.BOVINO:
      return "Bovino";
    case EspecieAnimal.OVINO:
      return "Ovino";
    case EspecieAnimal.CAPRINO:
      return "Caprino";
    case EspecieAnimal.OUTRO:
      return "Outro";
    default:
      return especie;
  }
}

export function rotuloSexo(sexo: SexoAnimal): string {
  return sexo === SexoAnimal.MACHO ? "Macho" : "Fêmea";
}

export function rotuloStatusAnimal(status: StatusAnimal): string {
  switch (status) {
    case StatusAnimal.ATIVO:
      return "Ativo";
    case StatusAnimal.MORTO:
      return "Morto";
    case StatusAnimal.VENDIDO:
      return "Vendido";
    default:
      return status;
  }
}

export function rotuloFinalidade(finalidade: FinalidadeAnimal): string {
  switch (finalidade) {
    case FinalidadeAnimal.CORTE:
      return "Corte";
    case FinalidadeAnimal.LEITE:
      return "Leite";
    case FinalidadeAnimal.DUPLA_APTIDAO:
      return "Dupla aptidão";
    case FinalidadeAnimal.REPRODUCAO:
      return "Reprodução";
    default:
      return finalidade;
  }
}

export function rotuloTipoManejo(tipo: TipoManejo): string {
  switch (tipo) {
    case TipoManejo.VACINACAO:
      return "Vacinação";
    case TipoManejo.MEDICAMENTO:
      return "Medicamento";
    case TipoManejo.REPRODUCAO:
      return "Reprodução";
    case TipoManejo.NASCIMENTO:
      return "Nascimento";
    case TipoManejo.MORTE:
      return "Morte";
    default:
      return tipo;
  }
}

export function rotuloOcorrencia(tipo: TipoOcorrenciaReproducao): string {
  switch (tipo) {
    case TipoOcorrenciaReproducao.COBERTURA:
      return "Cobertura";
    case TipoOcorrenciaReproducao.INSEMINACAO:
      return "Inseminação";
    case TipoOcorrenciaReproducao.DIAGNOSTICO_GESTACAO:
      return "Diagnóstico de gestação";
    default:
      return tipo;
  }
}

export function rotuloStatusPrazo(status: StatusPrazo): string {
  switch (status) {
    case StatusPrazo.EM_ANDAMENTO:
      return "Em andamento";
    case StatusPrazo.VENCIDO:
      return "Vencido";
    case StatusPrazo.LIBERADO:
      return "Liberado";
    default:
      return status;
  }
}

export function tomStatusPrazo(
  status: StatusPrazo,
): "andamento" | "perigo" | "positivo" {
  switch (status) {
    case StatusPrazo.EM_ANDAMENTO:
      return "andamento";
    case StatusPrazo.VENCIDO:
      return "perigo";
    case StatusPrazo.LIBERADO:
      return "positivo";
    default:
      return "andamento";
  }
}

export function iniciais(nome: string): string {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (partes.length === 0) {
    return "?";
  }
  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}
