import { Animal } from '../../../dominio/entidades/Animal.js';
import { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';
import type { EspecieAnimal } from '../../../dominio/enumeracoes/EspecieAnimal.js';
import type { SexoAnimal } from '../../../dominio/enumeracoes/SexoAnimal.js';
import type { FinalidadeAnimal } from '../../../dominio/enumeracoes/FinalidadeAnimal.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export interface DadosCriarAnimal {
  identificacao: string;
  especie: EspecieAnimal;
  raca?: string;
  sexo: SexoAnimal;
  dataNascimento?: string;
  finalidade: FinalidadeAnimal;
  propriedadeId: string;
  loteId?: string;
}

export class CriarAnimal {
  constructor(private readonly repositorio: IRepositorioAnimal) {}

  async executar(dados: DadosCriarAnimal): Promise<Animal> {
    const existentes = await this.repositorio.listarPorPropriedade(dados.propriedadeId);
    const duplicado = existentes.some(
      (a) =>
        a.identificacao.trim().toLowerCase() ===
        dados.identificacao.trim().toLowerCase(),
    );
    if (duplicado) {
      throw new ErroDeDominio(
        'Já existe um animal com esta identificação nesta propriedade.',
      );
    }
    const animal = new Animal({
      id: crypto.randomUUID(),
      identificacao: dados.identificacao,
      especie: dados.especie,
      raca: dados.raca,
      sexo: dados.sexo,
      dataNascimento: dados.dataNascimento,
      finalidade: dados.finalidade,
      status: StatusAnimal.ATIVO,
      propriedadeId: dados.propriedadeId,
      loteId: dados.loteId,
    });
    return this.repositorio.criar(animal);
  }
}
