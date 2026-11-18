import { RegistroAlimentar } from '../../../dominio/entidades/RegistroAlimentar.js';
import type { IRepositorioRegistroAlimentar } from '../../../dominio/repositorios/IRepositorioRegistroAlimentar.js';
import type { IRepositorioAlimento } from '../../../dominio/repositorios/IRepositorioAlimento.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';

export interface DadosCriarRegistroAlimentar {
  alimentoId: string;
  animalId?: string;
  data: string;
  quantidade: number;
}

export class CriarRegistroAlimentar {
  constructor(
    private readonly repositorioRegistroAlimentar: IRepositorioRegistroAlimentar,
    private readonly repositorioAlimento: IRepositorioAlimento,
  ) {}

  async executar(dados: DadosCriarRegistroAlimentar): Promise<RegistroAlimentar> {
    const alimento = await this.repositorioAlimento.buscarPorId(dados.alimentoId);
    if (!alimento) {
      throw new ErroDeDominio('Alimento não encontrado.');
    }
    alimento.consumir(dados.quantidade);
    await this.repositorioAlimento.atualizar(alimento);

    const registro = new RegistroAlimentar({
      id: crypto.randomUUID(),
      alimentoId: dados.alimentoId,
      animalId: dados.animalId,
      data: dados.data,
      quantidade: dados.quantidade,
    });
    return this.repositorioRegistroAlimentar.criar(registro);
  }
}
