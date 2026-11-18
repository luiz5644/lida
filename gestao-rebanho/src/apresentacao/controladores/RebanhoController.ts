import { AtualizarAnimal } from "../../aplicacao/casos-de-uso/animal/AtualizarAnimal.js";
import { BuscarAnimal } from "../../aplicacao/casos-de-uso/animal/BuscarAnimal.js";
import { CriarAnimal } from "../../aplicacao/casos-de-uso/animal/CriarAnimal.js";
import { ListarAnimal } from "../../aplicacao/casos-de-uso/animal/ListarAnimal.js";
import { ListarHistoricoAnimal } from "../../aplicacao/casos-de-uso/animal/ListarHistoricoAnimal.js";
import { ObterDetalheAnimal } from "../../aplicacao/casos-de-uso/animal/ObterDetalheAnimal.js";
import { ObterEvolucaoPeso } from "../../aplicacao/casos-de-uso/animal/ObterEvolucaoPeso.js";
import { AtualizarLote } from "../../aplicacao/casos-de-uso/lote/AtualizarLote.js";
import { BuscarLote } from "../../aplicacao/casos-de-uso/lote/BuscarLote.js";
import { CriarLote } from "../../aplicacao/casos-de-uso/lote/CriarLote.js";
import { ListarAnimaisDoLote } from "../../aplicacao/casos-de-uso/lote/ListarAnimaisDoLote.js";
import { ListarLote } from "../../aplicacao/casos-de-uso/lote/ListarLote.js";
import { Animal } from "../../dominio/entidades/Animal.js";
import { Lote } from "../../dominio/entidades/Lote.js";
import { Propriedade } from "../../dominio/entidades/Propriedade.js";
import { EspecieAnimal } from "../../dominio/enumeracoes/EspecieAnimal.js";
import { FinalidadeAnimal } from "../../dominio/enumeracoes/FinalidadeAnimal.js";
import { SexoAnimal } from "../../dominio/enumeracoes/SexoAnimal.js";
import { ContextoTela, montarNaTela } from "../contexto.js";
import { mostrarToast } from "../componentes/toast.js";
import { descreverErro } from "../componentes/mensagem-erro.js";
import { ligarSeletorSegmentado } from "../componentes/seletor-segmentado.js";
import { RebanhoView } from "../visoes/RebanhoView.js";
import {
  carregarAnimaisDoUsuario,
  carregarLotesDoUsuario,
  pertenceAoUsuario,
} from "../utilitarios/dados.js";

export interface DependenciasRebanho {
  listarAnimal: ListarAnimal;
  buscarAnimal: BuscarAnimal;
  criarAnimal: CriarAnimal;
  atualizarAnimal: AtualizarAnimal;
  listarLote: ListarLote;
  buscarLote: BuscarLote;
  criarLote: CriarLote;
  atualizarLote: AtualizarLote;
  listarAnimaisDoLote: ListarAnimaisDoLote;
  obterDetalheAnimal: ObterDetalheAnimal;
  obterEvolucaoPeso: ObterEvolucaoPeso;
  listarHistoricoAnimal: ListarHistoricoAnimal;
}

interface ParametrosNovoAnimal {
  propriedadeId?: string;
  loteId?: string;
}

export class RebanhoController {
  private readonly view = new RebanhoView();
  private aba: "animais" | "lotes" = "animais";
  private busca = "";
  private temporizadorBusca: number | undefined;

  constructor(
    private readonly dependencias: DependenciasRebanho,
    private readonly propriedades: Propriedade[],
    private readonly tela: ContextoTela,
  ) {}

  async iniciarLista(manterFoco = false): Promise<void> {
    const animais = await carregarAnimaisDoUsuario(
      this.dependencias.listarAnimal,
      this.propriedades,
    );
    const lotes = await carregarLotesDoUsuario(
      this.dependencias.listarLote,
      this.propriedades,
    );

    const elemento = this.view.lista({
      animais,
      lotes,
      aba: this.aba,
      busca: this.busca,
    });
    montarNaTela(this.tela, elemento);

    ligarSeletorSegmentado(elemento, (valor) => {
      this.aba = valor === "lotes" ? "lotes" : "animais";
      this.busca = "";
      void this.iniciarLista();
    });

    const busca = elemento.querySelector<HTMLInputElement>("#busca-rebanho");
    busca?.addEventListener("input", () => {
      this.busca = busca.value;
      if (this.temporizadorBusca !== undefined) {
        window.clearTimeout(this.temporizadorBusca);
      }
      this.temporizadorBusca = window.setTimeout(() => {
        void this.iniciarLista(true);
      }, 180);
    });

    if (manterFoco && busca) {
      busca.focus();
      busca.setSelectionRange(this.busca.length, this.busca.length);
    }

    elemento
      .querySelector<HTMLButtonElement>("#btn-adicionar")
      ?.addEventListener("click", () => {
        this.tela.navegar(
          this.aba === "animais" ? "rebanho/animal/novo" : "rebanho/lote/novo",
        );
      });

    elemento
      .querySelectorAll<HTMLElement>("[data-animal]")
      .forEach((botao) => {
        botao.addEventListener("click", () => {
          const id = botao.dataset.animal;
          if (id) {
            this.tela.navegar(`rebanho/animal/${id}`);
          }
        });
      });

    elemento.querySelectorAll<HTMLElement>("[data-lote]").forEach((botao) => {
      botao.addEventListener("click", () => {
        const id = botao.dataset.lote;
        if (id) {
          this.tela.navegar(`rebanho/lote/${id}`);
        }
      });
    });
  }

  async iniciarNovoAnimal(parametros: ParametrosNovoAnimal): Promise<void> {
    if (this.propriedades.length === 0) {
      mostrarToast("Cadastre uma propriedade primeiro.", "erro");
      this.tela.navegar("onboarding");
      return;
    }
    const propriedadeSelecionada = pertenceAoUsuario(
      parametros.propriedadeId ?? "",
      this.propriedades,
    )
      ? parametros.propriedadeId
      : this.propriedades[0].id;
    const lotes = await carregarLotesDoUsuario(
      this.dependencias.listarLote,
      this.propriedades,
    );
    const lotesDaPropriedade = lotes.filter(
      (lote) => lote.propriedadeId === propriedadeSelecionada,
    );
    const loteSelecionado = lotesDaPropriedade.some(
      (lote) => lote.id === parametros.loteId,
    )
      ? parametros.loteId
      : undefined;

    const elemento = this.view.formularioAnimal({
      propriedades: this.propriedades,
      lotes: lotesDaPropriedade,
      propriedadeSelecionada,
      loteSelecionado,
    });
    montarNaTela(this.tela, elemento);

    elemento
      .querySelector<HTMLButtonElement>("#btn-voltar")
      ?.addEventListener("click", () => this.tela.navegar("rebanho"));

    const selectPropriedade =
      elemento.querySelector<HTMLSelectElement>("#propriedade");
    selectPropriedade?.addEventListener("change", () => {
      const propriedadeId = selectPropriedade.value;
      const filtrados = lotes.filter(
        (lote) => lote.propriedadeId === propriedadeId,
      );
      this.view.atualizarLotesDoFormulario(elemento, filtrados);
    });

    elemento
      .querySelector<HTMLFormElement>("#form-animal")
      ?.addEventListener("submit", (evento) => {
        evento.preventDefault();
        void this.salvarAnimal(elemento, null);
      });
  }

  async iniciarEditarAnimal(id: string): Promise<void> {
    try {
      const animal = await this.dependencias.buscarAnimal.executar(id);
      if (!pertenceAoUsuario(animal.propriedadeId, this.propriedades)) {
        throw new Error("Animal não encontrado.");
      }
      const lotes = await carregarLotesDoUsuario(
        this.dependencias.listarLote,
        this.propriedades,
      );
      const elemento = this.view.formularioAnimal({
        animal,
        propriedades: this.propriedades,
        lotes: lotes.filter(
          (lote) => lote.propriedadeId === animal.propriedadeId,
        ),
      });
      montarNaTela(this.tela, elemento);

      elemento
        .querySelector<HTMLButtonElement>("#btn-voltar")
        ?.addEventListener("click", () =>
          this.tela.navegar(`rebanho/animal/${animal.id}`),
        );

      elemento
        .querySelector<HTMLFormElement>("#form-animal")
        ?.addEventListener("submit", (evento) => {
          evento.preventDefault();
          void this.salvarAnimal(elemento, animal);
        });
    } catch (falha) {
      mostrarToast(descreverErro(falha), "erro");
      this.tela.navegar("rebanho");
    }
  }

  private async salvarAnimal(
    elemento: HTMLElement,
    animal: Animal | null,
  ): Promise<void> {
    const identificacao =
      elemento.querySelector<HTMLInputElement>("#identificacao")?.value.trim() ??
      "";
    const propriedadeId =
      animal?.propriedadeId ??
      elemento.querySelector<HTMLSelectElement>("#propriedade")?.value ??
      "";
    const especie = elemento.querySelector<HTMLSelectElement>("#especie")
      ?.value as EspecieAnimal | undefined;
    const sexo = elemento.querySelector<HTMLSelectElement>("#sexo")
      ?.value as SexoAnimal | undefined;
    const raca =
      elemento.querySelector<HTMLInputElement>("#raca")?.value.trim() ?? "";
    const dataNascimento =
      elemento.querySelector<HTMLInputElement>("#data-nascimento")?.value ?? "";
    const finalidade = elemento.querySelector<HTMLSelectElement>("#finalidade")
      ?.value as FinalidadeAnimal | undefined;
    const loteId = elemento.querySelector<HTMLSelectElement>("#lote")?.value ?? "";

    if (!identificacao) {
      this.view.exibirErro("Informe a identificação do animal.");
      return;
    }
    if (!propriedadeId) {
      this.view.exibirErro("Selecione a propriedade.");
      return;
    }
    if (!especie || !sexo || !finalidade) {
      this.view.exibirErro("Preencha espécie, sexo e finalidade.");
      return;
    }

    const botao = elemento.querySelector<HTMLButtonElement>(
      "#form-animal button[type=submit]",
    );
    if (botao) {
      botao.disabled = true;
    }
    try {
      let salvo: Animal;
      if (animal) {
        salvo = await this.dependencias.atualizarAnimal.executar(animal.id, {
          identificacao,
          especie,
          raca: raca || null,
          sexo,
          dataNascimento: dataNascimento || null,
          finalidade,
          loteId: loteId || null,
        });
        mostrarToast("Animal atualizado com sucesso.");
      } else {
        salvo = await this.dependencias.criarAnimal.executar({
          identificacao,
          especie,
          raca: raca || undefined,
          sexo,
          dataNascimento: dataNascimento || undefined,
          finalidade,
          propriedadeId,
          loteId: loteId || undefined,
        });
        mostrarToast("Animal cadastrado com sucesso.");
      }
      this.tela.navegar(`rebanho/animal/${salvo.id}`);
    } catch (falha) {
      this.view.exibirErro(descreverErro(falha));
    } finally {
      if (botao) {
        botao.disabled = false;
      }
    }
  }

  async iniciarDetalheAnimal(id: string): Promise<void> {
    try {
      const detalhe = await this.dependencias.obterDetalheAnimal.executar(id);
      if (!pertenceAoUsuario(detalhe.animal.propriedadeId, this.propriedades)) {
        throw new Error("Animal não encontrado.");
      }
      const evolucao = await this.dependencias.obterEvolucaoPeso.executar(id);
      const elemento = this.view.detalheAnimal({ detalhe, evolucao });
      montarNaTela(this.tela, elemento);

      elemento
        .querySelector<HTMLButtonElement>("#btn-voltar")
        ?.addEventListener("click", () => this.tela.navegar("rebanho"));
      elemento
        .querySelector<HTMLButtonElement>("#btn-editar")
        ?.addEventListener("click", () =>
          this.tela.navegar(`rebanho/animal/editar/${id}`),
        );
      elemento
        .querySelector<HTMLButtonElement>("#btn-pesagem")
        ?.addEventListener("click", () =>
          this.tela.navegar(`manejos/pesagem?animalId=${id}`),
        );
    } catch (falha) {
      mostrarToast(descreverErro(falha), "erro");
      this.tela.navegar("rebanho");
    }
  }

  iniciarNovoLote(): void {
    if (this.propriedades.length === 0) {
      mostrarToast("Cadastre uma propriedade primeiro.", "erro");
      this.tela.navegar("onboarding");
      return;
    }
    const elemento = this.view.formularioLote();
    montarNaTela(this.tela, elemento);
    elemento
      .querySelector<HTMLButtonElement>("#btn-voltar")
      ?.addEventListener("click", () => this.tela.navegar("rebanho"));
    elemento
      .querySelector<HTMLFormElement>("#form-lote")
      ?.addEventListener("submit", (evento) => {
        evento.preventDefault();
        void this.salvarLote(elemento, null);
      });
  }

  async iniciarEditarLote(id: string): Promise<void> {
    try {
      const lote = await this.dependencias.buscarLote.executar(id);
      if (!pertenceAoUsuario(lote.propriedadeId, this.propriedades)) {
        throw new Error("Lote não encontrado.");
      }
      const elemento = this.view.formularioLote(lote);
      montarNaTela(this.tela, elemento);
      elemento
        .querySelector<HTMLButtonElement>("#btn-voltar")
        ?.addEventListener("click", () =>
          this.tela.navegar(`rebanho/lote/${lote.id}`),
        );
      elemento
        .querySelector<HTMLFormElement>("#form-lote")
        ?.addEventListener("submit", (evento) => {
          evento.preventDefault();
          void this.salvarLote(elemento, lote);
        });
    } catch (falha) {
      mostrarToast(descreverErro(falha), "erro");
      this.tela.navegar("rebanho");
    }
  }

  private async salvarLote(
    elemento: HTMLElement,
    lote: Lote | null,
  ): Promise<void> {
    const nome =
      elemento.querySelector<HTMLInputElement>("#nome-lote")?.value.trim() ?? "";
    const finalidade =
      elemento.querySelector<HTMLInputElement>("#finalidade-lote")?.value.trim() ??
      "";
    if (!nome) {
      this.view.exibirErro("Informe o nome do lote.");
      return;
    }
    const botao = elemento.querySelector<HTMLButtonElement>(
      "#form-lote button[type=submit]",
    );
    if (botao) {
      botao.disabled = true;
    }
    try {
      let salvo: Lote;
      if (lote) {
        salvo = await this.dependencias.atualizarLote.executar(lote.id, {
          nome,
          finalidade: finalidade || null,
        });
        mostrarToast("Lote atualizado com sucesso.");
      } else {
        salvo = await this.dependencias.criarLote.executar({
          nome,
          finalidade: finalidade || undefined,
          propriedadeId: this.propriedades[0].id,
        });
        mostrarToast("Lote cadastrado com sucesso.");
      }
      this.tela.navegar(`rebanho/lote/${salvo.id}`);
    } catch (falha) {
      this.view.exibirErro(descreverErro(falha));
    } finally {
      if (botao) {
        botao.disabled = false;
      }
    }
  }

  async iniciarDetalheLote(id: string): Promise<void> {
    try {
      const lote = await this.dependencias.buscarLote.executar(id);
      if (!pertenceAoUsuario(lote.propriedadeId, this.propriedades)) {
        throw new Error("Lote não encontrado.");
      }
      const animais = await this.dependencias.listarAnimaisDoLote.executar(id);
      const todosLotes = await carregarLotesDoUsuario(
        this.dependencias.listarLote,
        this.propriedades,
      );
      const lotesPorId = new Map(
        todosLotes.map((item) => [item.id, item.nome]),
      );
      const elemento = this.view.detalheLote({
        lote,
        animais,
        lotesPorId,
      });
      montarNaTela(this.tela, elemento);

      elemento
        .querySelector<HTMLButtonElement>("#btn-voltar")
        ?.addEventListener("click", () => this.tela.navegar("rebanho"));
      elemento
        .querySelector<HTMLButtonElement>("#btn-editar-lote, #btn-editar")
        ?.addEventListener("click", () =>
          this.tela.navegar(`rebanho/lote/editar/${lote.id}`),
        );
      elemento
        .querySelector<HTMLButtonElement>("#btn-adicionar-animal-lote, #btn-adicionar-animal")
        ?.addEventListener("click", () =>
          this.tela.navegar(
            `rebanho/animal/novo?propriedadeId=${lote.propriedadeId}&loteId=${lote.id}`,
          ),
        );
      elemento
        .querySelectorAll<HTMLElement>("[data-animal]")
        .forEach((botao) => {
          botao.addEventListener("click", () => {
            const animalId = botao.dataset.animal;
            if (animalId) {
              this.tela.navegar(`rebanho/animal/${animalId}`);
            }
          });
        });
    } catch (falha) {
      mostrarToast(descreverErro(falha), "erro");
      this.tela.navegar("rebanho");
    }
  }
}
