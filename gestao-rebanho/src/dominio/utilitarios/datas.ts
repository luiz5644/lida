const FORMATO_ISO = /^\d{4}-\d{2}-\d{2}$/;

export function dataParaIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function hojeIso(): string {
  return dataParaIso(new Date());
}

export function ehDataIsoValida(valor: string | null | undefined): boolean {
  if (!valor || !FORMATO_ISO.test(valor)) {
    return false;
  }
  const [ano, mes, dia] = valor.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  );
}

export function ehDataFutura(valor: string): boolean {
  return valor > hojeIso();
}

export function adicionarDias(dataIso: string, dias: number): string {
  if (!ehDataIsoValida(dataIso)) {
    throw new Error("Data inválida.");
  }
  const [ano, mes, dia] = dataIso.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + dias);
  return dataParaIso(data);
}

export function ordenarPorDataAscendente<T extends { data: string }>(
  itens: T[],
): T[] {
  return [...itens].sort((a, b) => a.data.localeCompare(b.data));
}

export function ordenarPorDataDescendente<T extends { data: string }>(
  itens: T[],
): T[] {
  return [...itens].sort((a, b) => b.data.localeCompare(a.data));
}
