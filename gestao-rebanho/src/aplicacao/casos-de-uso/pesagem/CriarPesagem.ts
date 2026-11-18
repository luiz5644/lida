import { Pesagem } from '../../../dominio/entidades/Pesagem.js';
import type { IRepositorioPesagem } from '../../../dominio/repositorios/IRepositorioPesagem.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';

export interface DadosCriarPesagem {
  animalId: string;
  data: string;
  pesoKg: number;
}

export class CriarPesagem {
  constructor(
    private readonly repositorioPesagem: IRepositorioPesagem,
    private readonly repositorioAnimal: IRepositorioAnimal,
  ) {}

  async executar(dados: DadosCriarPesagem): Promise<Pesagem> {
    const animal = await this.repositorioAnimal.buscarPorId(dados.animalId);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }
    if (animal.status === StatusAnimal.MORTO) {
      throw new ErroDeDominio('Não é possível registrar pesagem para um animal morto.');
    }
    const pesagem = new Pesagem({
      id: crypto.randomUUID(),
      animalId: dados.animalId,
      data: dados.data,
      pesoKg: dados.pesoKg,
    });
    return this.repositorioPesagem.criar(pesagem);
  }
}
