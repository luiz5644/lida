import { Manejo } from '../../../dominio/entidades/Manejo.js';
import type { Animal } from '../../../dominio/entidades/Animal.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';
import { TipoManejo } from '../../../dominio/enumeracoes/TipoManejo.js';

export interface DadosRegistrarMorte {
  animalId: string;
  data: string;
  descricao?: string;
}

export interface ResultadoRegistrarMorte {
  manejo: Manejo;
  animal: Animal;
}

export class RegistrarMorte {
  constructor(
    private readonly repositorioManejo: IRepositorioManejo,
    private readonly repositorioAnimal: IRepositorioAnimal,
  ) {}

  async executar(dados: DadosRegistrarMorte): Promise<ResultadoRegistrarMorte> {
    const animal = await this.repositorioAnimal.buscarPorId(dados.animalId);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }
    if (animal.status === StatusAnimal.MORTO) {
      throw new ErroDeDominio('Animal já registrado como morto.');
    }
    const manejo = new Manejo({
      id: crypto.randomUUID(),
      tipo: TipoManejo.MORTE,
      animalId: dados.animalId,
      data: dados.data,
      descricao: dados.descricao,
    });
    const manejoSalvo = await this.repositorioManejo.criar(manejo);
    animal.registrarMorte();
    const animalAtualizado = await this.repositorioAnimal.atualizar(animal);
    return { manejo: manejoSalvo, animal: animalAtualizado };
  }
}
