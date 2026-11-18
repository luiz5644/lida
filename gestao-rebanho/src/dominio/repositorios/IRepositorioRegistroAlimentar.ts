import { RegistroAlimentar } from "../entidades/RegistroAlimentar.js";

export interface IRepositorioRegistroAlimentar {
  criar(registro: RegistroAlimentar): Promise<RegistroAlimentar>;
  listar(): Promise<RegistroAlimentar[]>;
  listarPorAnimal(animalId: string): Promise<RegistroAlimentar[]>;
  buscarPorId(id: string): Promise<RegistroAlimentar | null>;
  atualizar(registro: RegistroAlimentar): Promise<RegistroAlimentar>;
  remover(id: string): Promise<void>;
}
