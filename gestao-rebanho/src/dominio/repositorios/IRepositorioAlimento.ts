import { Alimento } from "../entidades/Alimento.js";

export interface IRepositorioAlimento {
  criar(alimento: Alimento): Promise<Alimento>;
  listar(): Promise<Alimento[]>;
  buscarPorId(id: string): Promise<Alimento | null>;
  atualizar(alimento: Alimento): Promise<Alimento>;
  remover(id: string): Promise<void>;
}
