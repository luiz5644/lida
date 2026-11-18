import { Pesagem } from "../entidades/Pesagem.js";

export interface IRepositorioPesagem {
  criar(pesagem: Pesagem): Promise<Pesagem>;
  listar(): Promise<Pesagem[]>;
  listarPorAnimal(animalId: string): Promise<Pesagem[]>;
  buscarPorId(id: string): Promise<Pesagem | null>;
  atualizar(pesagem: Pesagem): Promise<Pesagem>;
  remover(id: string): Promise<void>;
}
