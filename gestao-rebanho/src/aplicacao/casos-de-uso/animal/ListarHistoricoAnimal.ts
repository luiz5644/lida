import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import type { IRepositorioPesagem } from '../../../dominio/repositorios/IRepositorioPesagem.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import type { IRepositorioControleCarencia } from '../../../dominio/repositorios/IRepositorioControleCarencia.js';
import type { HistoricoItemDTO } from '../../dtos/index.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export class ListarHistoricoAnimal {
  constructor(
    private readonly repositorioAnimal: IRepositorioAnimal,
    private readonly repositorioPesagem: IRepositorioPesagem,
    private readonly repositorioManejo: IRepositorioManejo,
    private readonly repositorioControleCarencia: IRepositorioControleCarencia,
  ) {}

  async executar(animalId: string): Promise<HistoricoItemDTO[]> {
    const animal = await this.repositorioAnimal.buscarPorId(animalId);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }

    const [pesagens, manejos, carencias] = await Promise.all([
      this.repositorioPesagem.listarPorAnimal(animalId),
      this.repositorioManejo.listarPorAnimal(animalId),
      this.repositorioControleCarencia.listarPorAnimal(animalId),
    ]);

    const itensPesagem: HistoricoItemDTO[] = pesagens.map((p) => ({
      id: p.id,
      tipo: 'pesagem',
      data: p.data,
      descricao: `Peso registrado: ${p.pesoKg} kg`,
    }));

    const itensManejo: HistoricoItemDTO[] = manejos.map((m) => ({
      id: m.id,
      tipo: m.tipo.toLowerCase(),
      data: m.data,
      descricao: m.descricao ?? m.nomeProduto ?? m.tipo,
    }));

    const itensCarencia: HistoricoItemDTO[] = carencias.map((c) => ({
      id: c.id,
      tipo: 'carencia',
      data: c.dataAplicacao,
      descricao: `Carência até ${c.dataLiberacao}`,
    }));

    const todos: HistoricoItemDTO[] = [
      ...itensPesagem,
      ...itensManejo,
      ...itensCarencia,
    ];

    return todos.sort((a, b) => b.data.localeCompare(a.data));
  }
}
