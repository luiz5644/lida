import { Animal } from "../../dominio/entidades/Animal.js";
import { Lote } from "../../dominio/entidades/Lote.js";
import { Propriedade } from "../../dominio/entidades/Propriedade.js";
import { ListarAnimal } from "../../aplicacao/casos-de-uso/animal/ListarAnimal.js";
import { ListarLote } from "../../aplicacao/casos-de-uso/lote/ListarLote.js";

export function idsDasPropriedades(
  propriedades: Propriedade[],
): Set<string> {
  return new Set(propriedades.map((propriedade) => propriedade.id));
}

export function pertenceAoUsuario(
  propriedadeId: string,
  propriedades: Propriedade[],
): boolean {
  return propriedades.some((propriedade) => propriedade.id === propriedadeId);
}

export async function carregarAnimaisDoUsuario(
  listarAnimal: ListarAnimal,
  propriedades: Propriedade[],
): Promise<Animal[]> {
  const ids = idsDasPropriedades(propriedades);
  const animais = await listarAnimal.executar();
  return animais.filter((animal) => ids.has(animal.propriedadeId));
}

export async function carregarLotesDoUsuario(
  listarLote: ListarLote,
  propriedades: Propriedade[],
): Promise<Lote[]> {
  const ids = idsDasPropriedades(propriedades);
  const lotes = await listarLote.executar();
  return lotes.filter((lote) => ids.has(lote.propriedadeId));
}

export function somenteAtivos(animais: Animal[]): Animal[] {
  return animais.filter((animal) => animal.estaAtivo());
}
