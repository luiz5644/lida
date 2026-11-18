import { Manejo } from '../../../dominio/entidades/Manejo.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';
import { TipoManejo } from '../../../dominio/enumeracoes/TipoManejo.js';
import type { TipoOcorrenciaReproducao } from '../../../dominio/enumeracoes/TipoOcorrenciaReproducao.js';

export interface DadosRegistrarReproducao {
  animalId: string;
  tipoOcorrencia: TipoOcorrenciaReproducao;
  data: string;
  descricao?: string;
}

export class RegistrarReproducao {
  constructor(
    private readonly repositorioManejo: IRepositorioManejo,
    private readonly repositorioAnimal: IRepositorioAnimal,
  ) {}

  async executar(dados: DadosRegistrarReproducao): Promise<Manejo> {
    const animal = await this.repositorioAnimal.buscarPorId(dados.animalId);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }
    if (animal.status === StatusAnimal.MORTO) {
      throw new ErroDeDominio('Não é possível registrar reprodução para um animal morto.');
    }
    const manejo = new Manejo({
      id: crypto.randomUUID(),
      tipo: TipoManejo.REPRODUCAO,
      animalId: dados.animalId,
      data: dados.data,
      tipoOcorrencia: dados.tipoOcorrencia,
      descricao: dados.descricao,
    });
    return this.repositorioManejo.criar(manejo);
  }
}
