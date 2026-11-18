import { ListarAnimal } from "../../aplicacao/casos-de-uso/animal/ListarAnimal.js";
import { ListarRegistrosRecentes } from "../../aplicacao/casos-de-uso/inicio/ListarRegistrosRecentes.js";
import { Usuario } from "../../dominio/entidades/Usuario.js";
import { Propriedade } from "../../dominio/entidades/Propriedade.js";
import { ContextoTela, montarNaTela } from "../contexto.js";
import { mostrarToast } from "../componentes/toast.js";
import { descreverErro } from "../componentes/mensagem-erro.js";
import { InicioView } from "../visoes/InicioView.js";
import { carregarAnimaisDoUsuario } from "../utilitarios/dados.js";

export interface DependenciasInicio {
  listarAnimal: ListarAnimal;
  listarRegistrosRecentes: ListarRegistrosRecentes;
}

export class InicioController {
  private readonly view = new InicioView();

  constructor(
    private readonly dependencias: DependenciasInicio,
    private readonly usuario: Usuario,
    private readonly propriedades: Propriedade[],
    private readonly tela: ContextoTela,
  ) {}

  async iniciar(): Promise<void> {
    try {
      const animais = await carregarAnimaisDoUsuario(
        this.dependencias.listarAnimal,
        this.propriedades,
      );
      const animaisPermitidos = animais.map((animal) => animal.id);
      const registros =
        await this.dependencias.listarRegistrosRecentes.executar(
          animaisPermitidos,
        );

      const elemento = this.view.renderizar({
        nomeUsuario: this.usuario.nome,
        registros,
      });
      montarNaTela(this.tela, elemento);

      elemento
        .querySelectorAll<HTMLElement>("[data-rota]")
        .forEach((botao) => {
          botao.addEventListener("click", () => {
            const rota = botao.dataset.rota;
            if (rota) {
              this.tela.navegar(rota);
            }
          });
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
    } catch (falha) {
      mostrarToast(descreverErro(falha), "erro");
    }
  }
}
