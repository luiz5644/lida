import { Propriedade } from "../entidades/Propriedade.js";

export interface IRepositorioPropriedade {
  criar(propriedade: Propriedade): Promise<Propriedade>;
  listar(): Promise<Propriedade[]>;
  listarPorUsuario(usuarioId: string): Promise<Propriedade[]>;
  buscarPorId(id: string): Promise<Propriedade | null>;
  atualizar(propriedade: Propriedade): Promise<Propriedade>;
  remover(id: string): Promise<void>;
}
