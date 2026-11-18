import { ControleCarencia } from "../../../dominio/entidades/ControleCarencia.js";
import { ErroDeDominio } from "../../../dominio/erros/ErroDeDominio.js";
import { IRepositorioControleCarencia } from "../../../dominio/repositorios/IRepositorioControleCarencia.js";
import { IRepositorioProdutoSanitario } from "../../../dominio/repositorios/IRepositorioProdutoSanitario.js";

export interface DadosCriarControle {
  animalId: string;
  produtoSanitarioId: string;
  dataAplicacao: string;
  observacao?: string;
}

export class CriarControleCarencia {
  constructor(
    private readonly repositorio: IRepositorioControleCarencia,
    private readonly produtos: IRepositorioProdutoSanitario,
  ) {}

  async executar(dados: DadosCriarControle): Promise<ControleCarencia> {
    const produto = await this.produtos.buscarPorId(dados.produtoSanitarioId);
    if (!produto) {
      throw new ErroDeDominio("Produto sanitário não encontrado.");
    }
    const controle = new ControleCarencia({
      id: crypto.randomUUID(),
      animalId: dados.animalId,
      produtoSanitarioId: produto.id,
      dataAplicacao: dados.dataAplicacao,
      dataLiberacao: ControleCarencia.calcularDataLiberacao(
        dados.dataAplicacao,
        produto.carenciaDias,
      ),
      observacao: dados.observacao,
    });
    return this.repositorio.criar(controle);
  }
}
