import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import type { IRepositorioPesagem } from '../../../dominio/repositorios/IRepositorioPesagem.js';
import type { EvolucaoPesoDTO } from '../../dtos/index.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class ObterEvolucaoPeso {
  constructor(
    private readonly repositorioAnimal: IRepositorioAnimal,
    private readonly repositorioPesagem: IRepositorioPesagem,
  ) {}

  async executar(animalId: string): Promise<EvolucaoPesoDTO> {
    const animal = await this.repositorioAnimal.buscarPorId(animalId);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }

    const pesagens = await this.repositorioPesagem.listarPorAnimal(animalId);
    const ordenadas = [...pesagens].sort((a, b) => a.data.localeCompare(b.data));

    const pontos = ordenadas.map((p) => ({ data: p.data, peso: p.pesoKg }));

    const ordenadasDesc = [...ordenadas].reverse();
    const pesoAtual = ordenadasDesc[0]?.pesoKg;
    const pesoAnterior = ordenadasDesc[1]?.pesoKg;
    const variacao =
      pesoAtual !== undefined && pesoAnterior !== undefined
        ? Math.round((pesoAtual - pesoAnterior) * 100) / 100
        : undefined;

    return { pesoAtual, pesoAnterior, variacao, pontos };
  }
}
