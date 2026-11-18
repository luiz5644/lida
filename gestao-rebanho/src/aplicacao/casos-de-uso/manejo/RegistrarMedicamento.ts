import { Manejo } from '../../../dominio/entidades/Manejo.js';
import { ControleCarencia } from '../../../dominio/entidades/ControleCarencia.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import type { IRepositorioControleCarencia } from '../../../dominio/repositorios/IRepositorioControleCarencia.js';
import type { IRepositorioProdutoSanitario } from '../../../dominio/repositorios/IRepositorioProdutoSanitario.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';
import { TipoManejo } from '../../../dominio/enumeracoes/TipoManejo.js';

export interface DadosRegistrarMedicamento {
  animalId: string;
  produtoSanitarioId: string;
  dataAplicacao: string;
  descricao?: string;
}

export interface ResultadoRegistrarMedicamento {
  manejo: Manejo;
  controleCarencia: ControleCarencia;
}

export class RegistrarMedicamento {
  constructor(
    private readonly repositorioManejo: IRepositorioManejo,
    private readonly repositorioAnimal: IRepositorioAnimal,
    private readonly repositorioControleCarencia: IRepositorioControleCarencia,
    private readonly repositorioProdutoSanitario: IRepositorioProdutoSanitario,
  ) {}

  async executar(dados: DadosRegistrarMedicamento): Promise<ResultadoRegistrarMedicamento> {
    const animal = await this.repositorioAnimal.buscarPorId(dados.animalId);
    if (!animal) {
      throw new ErroDeDominio('Animal não encontrado.');
    }
    if (animal.status === StatusAnimal.MORTO) {
      throw new ErroDeDominio('Não é possível registrar medicamento para um animal morto.');
    }

    const produto = await this.repositorioProdutoSanitario.buscarPorId(dados.produtoSanitarioId);
    if (!produto) {
      throw new ErroDeDominio('Produto sanitário não encontrado.');
    }

    const dataLiberacao = ControleCarencia.calcularDataLiberacao(
      dados.dataAplicacao,
      produto.carenciaDias,
    );

    const manejo = new Manejo({
      id: crypto.randomUUID(),
      tipo: TipoManejo.MEDICAMENTO,
      animalId: dados.animalId,
      data: dados.dataAplicacao,
      nomeProduto: produto.nome,
      descricao: dados.descricao,
    });
    const manejoSalvo = await this.repositorioManejo.criar(manejo);

    const controleCarencia = new ControleCarencia({
      id: crypto.randomUUID(),
      animalId: dados.animalId,
      produtoSanitarioId: dados.produtoSanitarioId,
      dataAplicacao: dados.dataAplicacao,
      dataLiberacao,
    });
    const controleSalvo = await this.repositorioControleCarencia.criar(controleCarencia);

    return { manejo: manejoSalvo, controleCarencia: controleSalvo };
  }
}
