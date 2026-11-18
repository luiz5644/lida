import type { Animal } from '../../../dominio/entidades/Animal.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import type { EspecieAnimal } from '../../../dominio/enumeracoes/EspecieAnimal.js';
import type { SexoAnimal } from '../../../dominio/enumeracoes/SexoAnimal.js';
import type { FinalidadeAnimal } from '../../../dominio/enumeracoes/FinalidadeAnimal.js';
import type { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';

export interface DadosAtualizarAnimal {
  identificacao?: string;
  especie?: EspecieAnimal;
  raca?: string | null;
  sexo?: SexoAnimal;
  dataNascimento?: string | null;
  finalidade?: FinalidadeAnimal;
  status?: StatusAnimal;
  loteId?: string | null;
}

export class AtualizarAnimal {
  constructor(private readonly repositorio: IRepositorioAnimal) {}

  async executar(id: string, dados: DadosAtualizarAnimal): Promise<Animal> {
    const animal = await this.repositorio.buscarPorId(id);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }
    if (dados.identificacao !== undefined) {
      const existentes = await this.repositorio.listarPorPropriedade(animal.propriedadeId);
      const duplicado = existentes.some(
        (a) =>
          a.id !== id &&
          a.identificacao.trim().toLowerCase() ===
            dados.identificacao!.trim().toLowerCase(),
      );
      if (duplicado) {
        throw new ErroDeDominio(
          'Já existe um animal com esta identificação nesta propriedade.',
        );
      }
    }
    animal.atualizar(dados);
    return this.repositorio.atualizar(animal);
  }
}
