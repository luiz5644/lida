import { Manejo } from "../entidades/Manejo.js";

export interface IRepositorioManejo {
  criar(manejo: Manejo): Promise<Manejo>;
  listar(): Promise<Manejo[]>;
  listarPorAnimal(animalId: string): Promise<Manejo[]>;
  listarPorLote(loteId: string): Promise<Manejo[]>;
  buscarPorId(id: string): Promise<Manejo | null>;
  atualizar(manejo: Manejo): Promise<Manejo>;
  remover(id: string): Promise<void>;
}
