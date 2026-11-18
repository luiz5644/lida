import { ControleCarencia } from "../entidades/ControleCarencia.js";

export interface IRepositorioControleCarencia {
  criar(controle: ControleCarencia): Promise<ControleCarencia>;
  listar(): Promise<ControleCarencia[]>;
  listarPorAnimal(animalId: string): Promise<ControleCarencia[]>;
  buscarPorId(id: string): Promise<ControleCarencia | null>;
  atualizar(controle: ControleCarencia): Promise<ControleCarencia>;
  remover(id: string): Promise<void>;
}
