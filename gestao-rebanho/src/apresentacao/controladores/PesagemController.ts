import { CriarPesagem } from "../../aplicacao/casos-de-uso/pesagem/CriarPesagem.js";
import { ListarAnimal } from "../../aplicacao/casos-de-uso/animal/ListarAnimal.js";
import { Propriedade } from "../../dominio/entidades/Propriedade.js";
import { ContextoTela, montarNaTela } from "../contexto.js";
import { mostrarToast } from "../componentes/toast.js";
import { descreverErro } from "../componentes/mensagem-erro.js";
import { PesagemView } from "../visoes/PesagemView.js";
import {
  carregarAnimaisDoUsuario,
  somenteAtivos,
} from "../utilitarios/dados.js";

export interface DependenciasPesagem {
  listarAnimal: ListarAnimal;
  criarPesagem: CriarPesagem;
}

export class PesagemController {
  private readonly view = new PesagemView();

  constructor(
    private readonly dependencias: DependenciasPesagem,
    private readonly propriedades: Propriedade[],
    private readonly tela: ContextoTela,
  ) {}

  async iniciar(animalId?: string): Promise<void> {
    const animais = somenteAtivos(
      await carregarAnimaisDoUsuario(
        this.dependencias.listarAnimal,
        this.propriedades,
      ),
    );

    if (animais.length === 0) {
      const elemento = this.view.semAnimais();
      montarNaTela(this.tela, elemento);
      elemento
        .querySelector<HTMLButtonElement>("#btn-voltar")
        ?.addEventListener("click", () => this.tela.navegar("manejos"));
      elemento
        .querySelector<HTMLButtonElement>("#btn-adicionar-animal")
        ?.addEventListener("click", () =>
          this.tela.navegar("rebanho/animal/novo"),
        );
      return;
    }

    const selecionado = animais.some((animal) => animal.id === animalId)
      ? animalId ?? ""
      : "";
    const elemento = this.view.formulario(animais, selecionado);
    montarNaTela(this.tela, elemento);

    const voltarPara = selecionado
      ? `rebanho/animal/${selecionado}`
      : "manejos";
    elemento
      .querySelector<HTMLButtonElement>("#btn-voltar")
      ?.addEventListener("click", () => this.tela.navegar(voltarPara));

    elemento
      .querySelector<HTMLFormElement>("#form-manejo")
      ?.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const selectAnimal =
          elemento.querySelector<HTMLSelectElement>("#animal-pesagem");
        const data =
          elemento.querySelector<HTMLInputElement>("#data-pesagem")?.value ?? "";
        const pesoTexto =
          elemento.querySelector<HTMLInputElement>("#peso-pesagem")?.value ?? "";
        const peso = Number(pesoTexto.replace(",", "."));

        if (!selectAnimal?.value) {
          this.view.exibirErro("Selecione o animal.");
          return;
        }
        if (!Number.isFinite(peso) || peso <= 0) {
          this.view.exibirErro("O peso deve ser maior que zero.");
          return;
        }

        const botao = elemento.querySelector<HTMLButtonElement>(
          "#form-manejo button[type=submit]",
        );
        if (botao) {
          botao.disabled = true;
        }
        try {
          await this.dependencias.criarPesagem.executar({
            animalId: selectAnimal.value,
            data,
            pesoKg: peso,
          });
          mostrarToast("Pesagem registrada com sucesso.");
          this.tela.navegar(`rebanho/animal/${selectAnimal.value}`);
        } catch (falha) {
          this.view.exibirErro(descreverErro(falha));
        } finally {
          if (botao) {
            botao.disabled = false;
          }
        }
      });
  }
}
