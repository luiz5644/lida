import { ListarAnimal } from "../../aplicacao/casos-de-uso/animal/ListarAnimal.js";
import { ListarLote } from "../../aplicacao/casos-de-uso/lote/ListarLote.js";
import { CriarProdutoSanitario } from "../../aplicacao/casos-de-uso/produto-sanitario/CriarProdutoSanitario.js";
import { ListarProdutoSanitario } from "../../aplicacao/casos-de-uso/produto-sanitario/ListarProdutoSanitario.js";
import { RegistrarMedicamento } from "../../aplicacao/casos-de-uso/manejo/RegistrarMedicamento.js";
import { RegistrarMorte } from "../../aplicacao/casos-de-uso/manejo/RegistrarMorte.js";
import { RegistrarNascimento } from "../../aplicacao/casos-de-uso/manejo/RegistrarNascimento.js";
import { RegistrarReproducao } from "../../aplicacao/casos-de-uso/manejo/RegistrarReproducao.js";
import { RegistrarVacinacao } from "../../aplicacao/casos-de-uso/manejo/RegistrarVacinacao.js";
import { Propriedade } from "../../dominio/entidades/Propriedade.js";
import { TipoOcorrenciaReproducao } from "../../dominio/enumeracoes/TipoOcorrenciaReproducao.js";
import { ContextoTela, montarNaTela } from "../contexto.js";
import { mostrarToast } from "../componentes/toast.js";
import { descreverErro } from "../componentes/mensagem-erro.js";
import { confirmar } from "../componentes/modal.js";
import { ligarSeletorSegmentado } from "../componentes/seletor-segmentado.js";
import { ManejoView } from "../visoes/ManejoView.js";
import { formatarData } from "../utilitarios/formatadores.js";
import {
  carregarAnimaisDoUsuario,
  carregarLotesDoUsuario,
  somenteAtivos,
} from "../utilitarios/dados.js";

export interface DependenciasManejo {
  listarAnimal: ListarAnimal;
  listarLote: ListarLote;
  listarProdutoSanitario: ListarProdutoSanitario;
  criarProdutoSanitario: CriarProdutoSanitario;
  registrarVacinacao: RegistrarVacinacao;
  registrarMedicamento: RegistrarMedicamento;
  registrarReproducao: RegistrarReproducao;
  registrarNascimento: RegistrarNascimento;
  registrarMorte: RegistrarMorte;
}

type TipoFormulario =
  | "vacinacao"
  | "medicamento"
  | "produto-sanitario"
  | "reproducao"
  | "nascimento"
  | "morte";

export class ManejoController {
  private readonly view = new ManejoView();

  constructor(
    private readonly dependencias: DependenciasManejo,
    private readonly propriedades: Propriedade[],
    private readonly tela: ContextoTela,
  ) {}

  iniciarHub(): void {
    const elemento = this.view.hub();
    montarNaTela(this.tela, elemento);
    elemento.querySelectorAll<HTMLElement>("[data-manejo]").forEach((botao) => {
      botao.addEventListener("click", () => {
        const rota = botao.dataset.manejo;
        if (rota) {
          this.tela.navegar(
            rota === "pesagem" ? "manejos/pesagem" : `manejos/${rota}`,
          );
        }
      });
    });
  }

  async iniciarFormulario(tipo: TipoFormulario): Promise<void> {
    const animais = await carregarAnimaisDoUsuario(
      this.dependencias.listarAnimal,
      this.propriedades,
    );
    const ativos = somenteAtivos(animais);

    if (tipo === "produto-sanitario") {
      this.montarProdutoSanitario();
      return;
    }

    if (tipo === "nascimento") {
      this.montarNascimento(ativos);
      return;
    }

    if (ativos.length === 0) {
      this.montarSemAnimais(tipo);
      return;
    }

    switch (tipo) {
      case "vacinacao": {
        const lotes = await carregarLotesDoUsuario(
          this.dependencias.listarLote,
          this.propriedades,
        );
        this.montarVacinacao(ativos, lotes);
        break;
      }
      case "medicamento": {
        const produtos =
          await this.dependencias.listarProdutoSanitario.executar();
        this.montarMedicamento(ativos, produtos);
        break;
      }
      case "reproducao":
        this.montarReproducao(ativos);
        break;
      case "morte":
        this.montarMorte(ativos);
        break;
      default:
        this.tela.navegar("manejos");
    }
  }

  private montarVacinacao(
    animais: Awaited<ReturnType<typeof carregarAnimaisDoUsuario>>,
    lotes: Awaited<ReturnType<typeof carregarLotesDoUsuario>>,
  ): void {
    const elemento = this.view.formularioVacinacao(animais, lotes);
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "manejos");

    let modo: "animal" | "lote" = "animal";
    ligarSeletorSegmentado(elemento, (valor) => {
      modo = valor === "lote" ? "lote" : "animal";
      const grupoAnimal = elemento.querySelector<HTMLElement>("#grupo-animal");
      const grupoLote = elemento.querySelector<HTMLElement>("#grupo-lote");
      if (grupoAnimal) {
        grupoAnimal.hidden = modo !== "animal";
      }
      if (grupoLote) {
        grupoLote.hidden = modo !== "lote";
      }
    });

    elemento
      .querySelector<HTMLFormElement>("#form-manejo")
      ?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const animalId =
          modo === "animal" ? this.valor(elemento, "animal-vacinacao") : "";
        const loteId =
          modo === "lote" ? this.valor(elemento, "lote-vacinacao") : "";
        const nomeProduto = this.valor(elemento, "vacina");
        const data = this.valor(elemento, "data-vacinacao");

        if (!animalId && !loteId) {
          this.view.exibirErro("Selecione um animal ou um lote.");
          return;
        }
        if (!nomeProduto) {
          this.view.exibirErro("Informe a vacina aplicada.");
          return;
        }
        try {
          const resultado = await this.dependencias.registrarVacinacao.executar({
            modo,
            animalId: animalId || undefined,
            loteId: loteId || undefined,
            nomeVacina: nomeProduto,
            dataAplicacao: data,
          });
          const total = Array.isArray(resultado) ? resultado.length : 1;
          mostrarToast(
            total === 1
              ? "Vacinação registrada com sucesso."
              : `Vacinação registrada para ${total} animais.`,
          );
          this.tela.navegar("manejos");
        } catch (falha) {
          this.view.exibirErro(descreverErro(falha));
        }
      });
  }

  private montarMedicamento(
    animais: Awaited<ReturnType<typeof carregarAnimaisDoUsuario>>,
    produtos: Awaited<
      ReturnType<ListarProdutoSanitario["executar"]>
    >,
  ): void {
    const elemento = this.view.formularioMedicamento(animais, produtos);
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "manejos");

    elemento
      .querySelector<HTMLButtonElement>("#btn-novo-produto")
      ?.addEventListener("click", () =>
        this.tela.navegar("manejos/produto-sanitario"),
      );

    elemento
      .querySelector<HTMLFormElement>("#form-manejo")
      ?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const animalId = this.valor(elemento, "animal-medicamento");
        const produtoSanitarioId = this.valor(elemento, "produto-medicamento");
        const data = this.valor(elemento, "data-medicamento");
        const observacao = this.valor(elemento, "observacao-medicamento");

        if (!animalId) {
          this.view.exibirErro("Selecione o animal.");
          return;
        }
        if (!produtoSanitarioId) {
          this.view.exibirErro("Selecione o medicamento.");
          return;
        }
        try {
          const resultado =
            await this.dependencias.registrarMedicamento.executar({
              animalId,
              produtoSanitarioId,
              dataAplicacao: data,
              descricao: observacao || undefined,
            });
          mostrarToast(
            `Medicamento registrado. Carência até ${formatarData(
              resultado.controleCarencia.dataLiberacao,
            )}.`,
          );
          this.tela.navegar("manejos");
        } catch (falha) {
          this.view.exibirErro(descreverErro(falha));
        }
      });
  }

  private montarProdutoSanitario(): void {
    const elemento = this.view.formularioProdutoSanitario();
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "manejos/medicamento");

    elemento
      .querySelector<HTMLFormElement>("#form-manejo")
      ?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const nome = this.valor(elemento, "nome-produto");
        const carencia = Number(this.valor(elemento, "carencia-produto"));
        if (!nome) {
          this.view.exibirErro("Informe o nome do produto.");
          return;
        }
        if (!Number.isInteger(carencia) || carencia < 0) {
          this.view.exibirErro(
            "Informe os dias de carência como um número inteiro maior ou igual a zero.",
          );
          return;
        }
        try {
          await this.dependencias.criarProdutoSanitario.executar({
            nome,
            carenciaDias: carencia,
          });
          mostrarToast("Produto sanitário cadastrado com sucesso.");
          this.tela.navegar("manejos/medicamento");
        } catch (falha) {
          this.view.exibirErro(descreverErro(falha));
        }
      });
  }

  private montarReproducao(
    animais: Awaited<ReturnType<typeof carregarAnimaisDoUsuario>>,
  ): void {
    const elemento = this.view.formularioReproducao(animais);
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "manejos");

    elemento
      .querySelector<HTMLFormElement>("#form-manejo")
      ?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const animalId = this.valor(elemento, "animal-reproducao");
        const tipoOcorrencia = this.valor(
          elemento,
          "tipo-ocorrencia",
        ) as TipoOcorrenciaReproducao;
        const data = this.valor(elemento, "data-reproducao");
        const descricao = this.valor(elemento, "descricao-reproducao");

        if (!animalId) {
          this.view.exibirErro("Selecione o animal.");
          return;
        }
        if (!tipoOcorrencia) {
          this.view.exibirErro("Selecione o tipo de ocorrência.");
          return;
        }
        try {
          await this.dependencias.registrarReproducao.executar({
            animalId,
            tipoOcorrencia,
            data,
            descricao: descricao || undefined,
          });
          mostrarToast("Reprodução registrada com sucesso.");
          this.tela.navegar("manejos");
        } catch (falha) {
          this.view.exibirErro(descreverErro(falha));
        }
      });
  }

  private montarNascimento(
    animais: Awaited<ReturnType<typeof carregarAnimaisDoUsuario>>,
  ): void {
    const elemento = this.view.formularioNascimento(animais);
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "manejos");

    elemento
      .querySelector<HTMLButtonElement>("#btn-cadastrar-animal")
      ?.addEventListener("click", () =>
        this.tela.navegar("rebanho/animal/novo"),
      );

    elemento
      .querySelector<HTMLFormElement>("#form-manejo")
      ?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const animalRelacionadoId = this.valor(elemento, "animal-nascimento");
        const data = this.valor(elemento, "data-nascimento-manejo");
        const descricao = this.valor(elemento, "descricao-nascimento");
        try {
          await this.dependencias.registrarNascimento.executar({
            animalRelacionadoId: animalRelacionadoId || undefined,
            dataNascimento: data,
            descricao: descricao || undefined,
          });
          mostrarToast("Nascimento registrado com sucesso.");
          this.tela.navegar("manejos");
        } catch (falha) {
          this.view.exibirErro(descreverErro(falha));
        }
      });
  }

  private montarMorte(
    animais: Awaited<ReturnType<typeof carregarAnimaisDoUsuario>>,
  ): void {
    const elemento = this.view.formularioMorte(animais);
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "manejos");

    elemento
      .querySelector<HTMLFormElement>("#form-manejo")
      ?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const animalId = this.valor(elemento, "animal-morte");
        const data = this.valor(elemento, "data-morte");
        const observacao = this.valor(elemento, "observacao-morte");
        if (!animalId) {
          this.view.exibirErro("Selecione o animal.");
          return;
        }
        const escolha = await confirmar({
          titulo: "Registrar morte",
          mensagem:
            "O animal será marcado como MORTO e não aparecerá mais nos selectores de novos manejos. Deseja continuar?",
          textoConfirmar: "Registrar morte",
          perigo: true,
        });
        if (!escolha) {
          return;
        }
        try {
          await this.dependencias.registrarMorte.executar({
            animalId,
            data,
            descricao: observacao || undefined,
          });
          mostrarToast("Morte registrada. O histórico foi atualizado.");
          this.tela.navegar("manejos");
        } catch (falha) {
          this.view.exibirErro(descreverErro(falha));
        }
      });
  }

  private montarSemAnimais(tipo: TipoFormulario): void {
    const titulos: Record<TipoFormulario, string> = {
      vacinacao: "Registrar vacinação",
      medicamento: "Registrar medicamento",
      "produto-sanitario": "Cadastrar produto sanitário",
      reproducao: "Registrar reprodução",
      nascimento: "Registrar nascimento",
      morte: "Registrar morte",
    };
    const elemento = this.view.semAnimais(titulos[tipo]);
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "manejos");
    elemento
      .querySelector<HTMLButtonElement>("#btn-adicionar-animal")
      ?.addEventListener("click", () =>
        this.tela.navegar("rebanho/animal/novo"),
      );
  }

  private ligarVoltar(raiz: HTMLElement, destino: string): void {
    raiz
      .querySelector<HTMLButtonElement>("#btn-voltar")
      ?.addEventListener("click", () => this.tela.navegar(destino));
  }

  private valor(raiz: HTMLElement, id: string): string {
    const campo = raiz.querySelector<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >(`#${id}`);
    return campo?.value.trim() ?? "";
  }
}
