import { Animal } from "../../../dominio/entidades/Animal.js";
import { StatusPrazo } from "../../../dominio/enumeracoes/StatusPrazo.js";
import { TipoManejo } from "../../../dominio/enumeracoes/TipoManejo.js";
import { hojeIso } from "../../../dominio/utilitarios/datas.js";
import { IRepositorioAnimal } from "../../../dominio/repositorios/IRepositorioAnimal.js";
import { IRepositorioControleCarencia } from "../../../dominio/repositorios/IRepositorioControleCarencia.js";
import { IRepositorioManejo } from "../../../dominio/repositorios/IRepositorioManejo.js";
import { IRepositorioProdutoSanitario } from "../../../dominio/repositorios/IRepositorioProdutoSanitario.js";
import { PrazoDTO } from "../../dtos/PrazoDTO.js";

export class ListarPrazos {
  constructor(
    private readonly controles: IRepositorioControleCarencia,
    private readonly produtos: IRepositorioProdutoSanitario,
    private readonly manejos: IRepositorioManejo,
    private readonly animais: IRepositorioAnimal,
  ) {}

  async executar(
    animalIdsPermitidos?: string[],
    filtro?: StatusPrazo,
  ): Promise<PrazoDTO[]> {
    const [controles, produtos, manejos, animais] = await Promise.all([
      this.controles.listar(),
      this.produtos.listar(),
      this.manejos.listar(),
      this.animais.listar(),
    ]);

    const mapaAnimais = new Map<string, Animal>(
      animais.map((animal) => [animal.id, animal]),
    );
    const mapaProdutos = new Map(produtos.map((produto) => [produto.id, produto]));
    const permitido = animalIdsPermitidos
      ? new Set(animalIdsPermitidos)
      : null;
    const hoje = hojeIso();

    const itens: PrazoDTO[] = [];

    for (const controle of controles) {
      if (permitido && !permitido.has(controle.animalId)) {
        continue;
      }
      const animal = mapaAnimais.get(controle.animalId);
      const produto = mapaProdutos.get(controle.produtoSanitarioId);
      if (!animal || !produto) {
        continue;
      }
      const status = controle.status(hoje);
      itens.push({
        id: `carencia:${controle.id}`,
        origem: "carencia",
        animalId: animal.id,
        animalNome: animal.identificacao,
        tipo: "Medicamento",
        descricao: produto.nome,
        data: controle.dataLiberacao,
        status,
      });
    }

    for (const manejo of manejos) {
      if (
        manejo.tipo !== TipoManejo.VACINACAO ||
        !manejo.dataReforco ||
        !manejo.animalId
      ) {
        continue;
      }
      if (permitido && !permitido.has(manejo.animalId)) {
        continue;
      }
      const animal = mapaAnimais.get(manejo.animalId);
      if (!animal) {
        continue;
      }
      const status =
        manejo.dataReforco >= hoje
          ? StatusPrazo.EM_ANDAMENTO
          : StatusPrazo.VENCIDO;
      itens.push({
        id: `reforco:${manejo.id}`,
        origem: "reforco",
        animalId: animal.id,
        animalNome: animal.identificacao,
        tipo: "Vacinação",
        descricao: manejo.nomeProduto ?? "Reforço de vacina",
        data: manejo.dataReforco,
        status,
      });
    }

    const filtrados = filtro
      ? itens.filter((item) => item.status === filtro)
      : itens;

    return filtrados.sort((a, b) => a.data.localeCompare(b.data));
  }
}
