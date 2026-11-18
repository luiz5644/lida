import { AtualizarAlimento } from "../../aplicacao/casos-de-uso/alimento/AtualizarAlimento.js";
import { BuscarAlimento } from "../../aplicacao/casos-de-uso/alimento/BuscarAlimento.js";
import { CriarAlimento } from "../../aplicacao/casos-de-uso/alimento/CriarAlimento.js";
import { ListarAlimento } from "../../aplicacao/casos-de-uso/alimento/ListarAlimento.js";
import { CriarRegistroAlimentar } from "../../aplicacao/casos-de-uso/registro-alimentar/CriarRegistroAlimentar.js";
import { Alimento } from "../../dominio/entidades/Alimento.js";
import { UndMedida } from "../../dominio/enumeracoes/UndMedida.js";
import { ContextoTela, montarNaTela } from "../contexto.js";
import { mostrarToast } from "../componentes/toast.js";
import { descreverErro } from "../componentes/mensagem-erro.js";
import { AlimentacaoView } from "../visoes/AlimentacaoView.js";

export interface DependenciasAlimentacao {
  listarAlimento: ListarAlimento;
  criarAlimento: CriarAlimento;
  atualizarAlimento: AtualizarAlimento;
  buscarAlimento: BuscarAlimento;
  criarRegistroAlimentar: CriarRegistroAlimentar;
}

export class AlimentacaoController {
  private readonly view = new AlimentacaoView();

  constructor(
    private readonly dependencias: DependenciasAlimentacao,
    private readonly tela: ContextoTela,
  ) {}

  async iniciarLista(): Promise<void> {
    try {
      const alimentos = await this.dependencias.listarAlimento.executar();
      const elemento = this.view.lista({ alimentos });
      montarNaTela(this.tela, elemento);

      elemento
        .querySelector<HTMLButtonElement>("#btn-novo-alimento")
        ?.addEventListener("click", () =>
          this.tela.navegar("alimentacao/novo"),
        );

      elemento
        .querySelectorAll<HTMLButtonElement>("[data-editar-alimento]")
        .forEach((botao) => {
          botao.addEventListener("click", () => {
            const id = botao.dataset.editarAlimento;
            if (id) {
              this.tela.navegar(`alimentacao/editar/${id}`);
            }
          });
        });

      elemento
        .querySelector<HTMLFormElement>("#form-consumo")
        ?.addEventListener("submit", (evento) => {
          evento.preventDefault();
          void this.registrarConsumo(elemento);
        });
    } catch (falha) {
      mostrarToast(descreverErro(falha), "erro");
    }
  }

  iniciarNovo(): void {
    const elemento = this.view.formulario();
    montarNaTela(this.tela, elemento);
    this.ligarFormulario(elemento, null);
  }

  async iniciarEditar(id: string): Promise<void> {
    try {
      const alimento = await this.dependencias.buscarAlimento.executar(id);
      const elemento = this.view.formulario(alimento);
      montarNaTela(this.tela, elemento);
      this.ligarFormulario(elemento, alimento);
    } catch (falha) {
      mostrarToast(descreverErro(falha), "erro");
      this.tela.navegar("alimentacao");
    }
  }

  private ligarFormulario(
    elemento: HTMLElement,
    alimento: Alimento | null,
  ): void {
    elemento
      .querySelector<HTMLButtonElement>("#btn-voltar")
      ?.addEventListener("click", () => this.tela.navegar("alimentacao"));

    elemento
      .querySelector<HTMLFormElement>("#form-alimento")
      ?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const nome =
          elemento.querySelector<HTMLInputElement>("#nome-alimento")?.value.trim() ??
          "";
        const unidade = elemento.querySelector<HTMLSelectElement>(
          "#unidade-alimento",
        )?.value as UndMedida | undefined;
        const quantidadeTexto =
          elemento.querySelector<HTMLInputElement>("#quantidade-alimento")
            ?.value ?? "";
        const quantidade = Number(quantidadeTexto.replace(",", "."));

        if (!nome) {
          this.view.exibirErro("Informe o nome do alimento.");
          return;
        }
        if (!unidade) {
          this.view.exibirErro("Selecione a unidade de medida.");
          return;
        }
        if (!Number.isFinite(quantidade) || quantidade < 0) {
          this.view.exibirErro(
            "Informe uma quantidade disponível maior ou igual a zero.",
          );
          return;
        }

        const botao = elemento.querySelector<HTMLButtonElement>(
          "#form-alimento button[type=submit]",
        );
        if (botao) {
          botao.disabled = true;
        }
        try {
          if (alimento) {
            await this.dependencias.atualizarAlimento.executar(alimento.id, {
              nome,
              unidade,
              quantidadeDisponivel: quantidade,
            });
            mostrarToast("Alimento atualizado com sucesso.");
          } else {
            await this.dependencias.criarAlimento.executar({
              nome,
              unidade,
              quantidadeDisponivel: quantidade,
            });
            mostrarToast("Alimento cadastrado com sucesso.");
          }
          this.tela.navegar("alimentacao");
        } catch (falha) {
          this.view.exibirErro(descreverErro(falha));
        } finally {
          if (botao) {
            botao.disabled = false;
          }
        }
      });
  }

  private async registrarConsumo(elemento: HTMLElement): Promise<void> {
    const alimentoId =
      elemento.querySelector<HTMLSelectElement>("#alimento-consumo")?.value ?? "";
    const data =
      elemento.querySelector<HTMLInputElement>("#data-consumo")?.value ?? "";
    const quantidadeTexto =
      elemento.querySelector<HTMLInputElement>("#quantidade-consumo")?.value ??
      "";
    const quantidade = Number(quantidadeTexto.replace(",", "."));

    if (!alimentoId) {
      this.view.exibirErro("Selecione o alimento.");
      return;
    }
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      this.view.exibirErro("A quantidade consumida deve ser maior que zero.");
      return;
    }

    const botao = elemento.querySelector<HTMLButtonElement>(
      "#form-consumo button[type=submit]",
    );
    if (botao) {
      botao.disabled = true;
    }
    try {
      await this.dependencias.criarRegistroAlimentar.executar({
        alimentoId,
        data,
        quantidade,
      });
      mostrarToast("Consumo registrado e estoque atualizado.");
      await this.iniciarLista();
    } catch (falha) {
      this.view.exibirErro(descreverErro(falha));
    } finally {
      if (botao) {
        botao.disabled = false;
      }
    }
  }
}
