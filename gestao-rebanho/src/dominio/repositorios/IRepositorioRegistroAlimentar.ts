import { RegistroAlimentar } from "../entidades/RegistroAlimentar.js";

export interface IRepositorioRegistroAlimentar {
  criar(registro: RegistroAlimentar): Promise<RegistroAlimentar>;
  listar(): Promise<RegistroAlimentar[]>;
  remover(id: string): Promise<void>;
}
