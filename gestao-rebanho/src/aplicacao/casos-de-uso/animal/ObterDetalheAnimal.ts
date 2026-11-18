import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import type { IRepositorioLote } from '../../../dominio/repositorios/IRepositorioLote.js';
import type { IRepositorioPropriedade } from '../../../dominio/repositorios/IRepositorioPropriedade.js';
import type { IRepositorioPesagem } from '../../../dominio/repositorios/IRepositorioPesagem.js';
import type { DetalheAnimalDTO } from '../../dtos/index.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class ObterDetalheAnimal {
  constructor(
    private readonly repositorioAnimal: IRepositorioAnimal,
    private readonly repositorioLote: IRepositorioLote,
    private readonly repositorioPropriedade: IRepositorioPropriedade,
    private readonly repositorioPesagem: IRepositorioPesagem,
  ) {}

  async executar(animalId: string): Promise<DetalheAnimalDTO> {
    const animal = await this.repositorioAnimal.buscarPorId(animalId);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }

    const propriedade = await this.repositorioPropriedade.buscarPorId(animal.propriedadeId);
    if (!propriedade) {
      throw new ErroDeDominio('Propriedade do animal não encontrada.');
    }

    let loteNome: string | undefined;
    if (animal.loteId) {
      const lote = await this.repositorioLote.buscarPorId(animal.loteId);
      loteNome = lote?.nome;
    }

    const pesagens = await this.repositorioPesagem.listarPorAnimal(animalId);
    const ordenadas = [...pesagens].sort((a, b) => b.data.localeCompare(a.data));

    const pesoAtual = ordenadas[0]?.pesoKg;
    const pesoAnterior = ordenadas[1]?.pesoKg;
    const variacaoPeso =
      pesoAtual !== undefined && pesoAnterior !== undefined
        ? Math.round((pesoAtual - pesoAnterior) * 100) / 100
        : undefined;

    return {
      animal,
      loteNome,
      propriedadeNome: propriedade.nome,
      pesoAtual,
      pesoAnterior,
      variacaoPeso,
      historico: [],
    };
  }
}
