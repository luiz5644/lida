import { Animal } from "../entidades/Animal.js";

export interface IRepositorioAnimal {
  criar(animal: Animal): Promise<Animal>;
  listar(): Promise<Animal[]>;
  listarPorPropriedade(propriedadeId: string): Promise<Animal[]>;
  listarPorLote(loteId: string): Promise<Animal[]>;
  buscarPorId(id: string): Promise<Animal | null>;
  atualizar(animal: Animal): Promise<Animal>;
  remover(id: string): Promise<void>;
}
