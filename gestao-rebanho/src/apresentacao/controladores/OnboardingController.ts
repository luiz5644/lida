import { CriarAnimal } from "../../aplicacao/casos-de-uso/animal/CriarAnimal.js";
import { CriarLote } from "../../aplicacao/casos-de-uso/lote/CriarLote.js";
import { ListarLote } from "../../aplicacao/casos-de-uso/lote/ListarLote.js";
import { ListarEstados } from "../../aplicacao/casos-de-uso/localidade/ListarEstados.js";
import { ListarMunicipios } from "../../aplicacao/casos-de-uso/localidade/ListarMunicipios.js";
import { CriarPropriedade } from "../../aplicacao/casos-de-uso/propriedade/CriarPropriedade.js";
import { Propriedade } from "../../dominio/entidades/Propriedade.js";
import { Usuario } from "../../dominio/entidades/Usuario.js";
import { EspecieAnimal } from "../../dominio/enumeracoes/EspecieAnimal.js";
import { FinalidadeAnimal } from "../../dominio/enumeracoes/FinalidadeAnimal.js";
import { SexoAnimal } from "../../dominio/enumeracoes/SexoAnimal.js";
import { hojeIso } from "../../dominio/utilitarios/datas.js";
import { ContextoTela, montarNaTela } from "../contexto.js";
import { ligarSeletorSegmentado } from "../componentes/seletor-segmentado.js";
import {
  descreverErro,
  exibirErro,
  limparMensagemErro,
} from "../componentes/mensagem-erro.js";
import { mostrarToast } from "../componentes/toast.js";
import { OnboardingView } from "../visoes/OnboardingView.js";

export interface DependenciasOnboarding {
  criarPropriedade: CriarPropriedade;
  criarAnimal: CriarAnimal;
  criarLote: CriarLote;
  listarLote: ListarLote;
  listarEstados: ListarEstados;
  listarMunicipios: ListarMunicipios;
}

export class OnboardingController {
  private readonly view = new OnboardingView();
  private etapa: 1 | 2 | 3;
  private propriedade: Propriedade | null;

  constructor(
    private readonly dependencias: DependenciasOnboarding,
    private readonly usuario: Usuario,
    propriedadesExistentes: Propriedade[],
    private readonly tela: ContextoTela,
  ) {
    this.propriedade = propriedadesExistentes[0] ?? null;
    this.etapa = this.propriedade ? 2 : 1;
  }

  async iniciar(): Promise<void> {
    if (this.etapa === 1) {
      await this.etapaPropriedade();
      return;
    }
    if (this.etapa === 2) {
      await this.etapaRebanho();
      return;
    }
    this.etapaConclusao();
  }

  private async etapaPropriedade(): Promise<void> {
    const estados = await this.dependencias.listarEstados.executar();
    const elemento = this.view.etapa1(estados);
    montarNaTela(this.tela, elemento);

    const selectEstado = elemento.querySelector<HTMLSelectElement>("#estado");
    const selectMunicipio =
      elemento.querySelector<HTMLSelectElement>("#municipio");
    const erro = elemento.querySelector<HTMLElement>("#erro-onboarding");

    const atualizarMunicipios = async (): Promise<void> => {
      const uf = selectEstado?.value ?? "";
      if (!uf) {
        this.view.preencherMunicipios(elemento, []);
        return;
      }
      try {
        const municipios = await this.dependencias.listarMunicipios.executar(uf);
        this.view.preencherMunicipios(elemento, municipios);
      } catch (falha) {
        exibirErro(erro, descreverErro(falha));
      }
    };

    selectEstado?.addEventListener("change", () => {
      if (selectMunicipio) {
        selectMunicipio.value = "";
      }
      void atualizarMunicipios();
    });

    const form = elemento.querySelector<HTMLFormElement>("#form-propriedade");
    form?.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagemErro(erro);
      const nome =
        elemento.querySelector<HTMLInputElement>("#nome-propriedade")?.value.trim() ??
        "";
      const estado = selectEstado?.value ?? "";
      const municipio = selectMunicipio?.value ?? "";
      if (!nome) {
        exibirErro(erro, "Informe o nome da propriedade.");
        return;
      }
      if (!estado) {
        exibirErro(erro, "Selecione o estado.");
        return;
      }
      if (!municipio) {
        exibirErro(erro, "Selecione o município.");
        return;
      }
      const botao = form.querySelector<HTMLButtonElement>(
        "button[type=submit]",
      );
      if (botao) {
        botao.disabled = true;
      }
      try {
        this.propriedade = await this.dependencias.criarPropriedade.executar({
          nome,
          estado,
          municipio,
          usuarioId: this.usuario.id,
        });
        this.etapa = 2;
        mostrarToast("Propriedade criada com sucesso.");
        await this.etapaRebanho();
      } catch (falha) {
        exibirErro(erro, descreverErro(falha));
      } finally {
        if (botao) {
          botao.disabled = false;
        }
      }
    });
  }

  private async etapaRebanho(): Promise<void> {
    if (!this.propriedade) {
      this.etapa = 1;
      await this.etapaPropriedade();
      return;
    }
    const todosLotes = await this.dependencias.listarLote.executar();
    const lotes = todosLotes.filter(
      (lote) => lote.propriedadeId === this.propriedade?.id,
    );
    const elemento = this.view.etapa2(lotes);
    montarNaTela(this.tela, elemento);
    const erro = elemento.querySelector<HTMLElement>("#erro-onboarding");
    const formAnimal = elemento.querySelector<HTMLFormElement>(
      "#form-onboarding-animal",
    );
    const formLote = elemento.querySelector<HTMLFormElement>(
      "#form-onboarding-lote",
    );

    ligarSeletorSegmentado(elemento, (valor) => {
      if (formAnimal) {
        formAnimal.hidden = valor !== "animal";
      }
      if (formLote) {
        formLote.hidden = valor !== "lote";
      }
      limparMensagemErro(erro);
    });

    const dataNascimento =
      elemento.querySelector<HTMLInputElement>("#data-nascimento");
    if (dataNascimento) {
      dataNascimento.max = hojeIso();
    }

    elemento
      .querySelector<HTMLButtonElement>("#btn-pular")
      ?.addEventListener("click", () => {
        this.etapa = 3;
        this.etapaConclusao();
      });

    formAnimal?.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagemErro(erro);
      const identificacao =
        elemento.querySelector<HTMLInputElement>("#identificacao")?.value.trim() ??
        "";
      const raca =
        elemento.querySelector<HTMLInputElement>("#raca")?.value.trim() ?? "";
      const especie = elemento.querySelector<HTMLSelectElement>("#especie")
        ?.value as EspecieAnimal | undefined;
      const sexo = elemento.querySelector<HTMLSelectElement>("#sexo")
        ?.value as SexoAnimal | undefined;
      const finalidade = elemento.querySelector<HTMLSelectElement>("#finalidade")
        ?.value as FinalidadeAnimal | undefined;
      const loteId =
        elemento.querySelector<HTMLSelectElement>("#lote")?.value ?? "";

      if (!identificacao) {
        exibirErro(erro, "Informe a identificação do animal.");
        return;
      }
      if (!especie || !sexo || !finalidade) {
        exibirErro(erro, "Preencha espécie, sexo e finalidade.");
        return;
      }

      const botao = formAnimal.querySelector<HTMLButtonElement>(
        "button[type=submit]",
      );
      if (botao) {
        botao.disabled = true;
      }
      try {
        await this.dependencias.criarAnimal.executar({
          identificacao,
          especie,
          raca: raca || undefined,
          sexo,
          dataNascimento: dataNascimento?.value || undefined,
          finalidade,
          propriedadeId: this.propriedade!.id,
          loteId: loteId || undefined,
        });
        this.etapa = 3;
        mostrarToast("Animal cadastrado com sucesso.");
        this.etapaConclusao();
      } catch (falha) {
        exibirErro(erro, descreverErro(falha));
      } finally {
        if (botao) {
          botao.disabled = false;
        }
      }
    });

    formLote?.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagemErro(erro);
      const nome =
        elemento.querySelector<HTMLInputElement>("#nome-lote")?.value.trim() ??
        "";
      const finalidade =
        elemento.querySelector<HTMLInputElement>("#finalidade-lote")?.value.trim() ??
        "";
      if (!nome) {
        exibirErro(erro, "Informe o nome do lote.");
        return;
      }
      const botao = formLote.querySelector<HTMLButtonElement>(
        "button[type=submit]",
      );
      if (botao) {
        botao.disabled = true;
      }
      try {
        await this.dependencias.criarLote.executar({
          nome,
          finalidade: finalidade || undefined,
          propriedadeId: this.propriedade!.id,
        });
        this.etapa = 3;
        mostrarToast("Lote cadastrado com sucesso.");
        this.etapaConclusao();
      } catch (falha) {
        exibirErro(erro, descreverErro(falha));
      } finally {
        if (botao) {
          botao.disabled = false;
        }
      }
    });
  }

  private etapaConclusao(): void {
    const elemento = this.view.etapa3(
      this.propriedade?.nome ?? "sua propriedade",
    );
    montarNaTela(this.tela, elemento);
    elemento
      .querySelector<HTMLButtonElement>("#btn-concluir")
      ?.addEventListener("click", () => this.tela.navegar("inicio"));
  }
}
