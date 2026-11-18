import { ListarAnimal } from "../../aplicacao/casos-de-uso/animal/ListarAnimal.js";
import { ListarPrazos } from "../../aplicacao/casos-de-uso/prazos/ListarPrazos.js";
import { PrazoDTO } from "../../aplicacao/dtos/PrazoDTO.js";
import { Propriedade } from "../../dominio/entidades/Propriedade.js";
import { ContextoTela, montarNaTela } from "../contexto.js";
import { ligarChips } from "../componentes/chips-filtro.js";
import { mostrarToast } from "../componentes/toast.js";
import { descreverErro } from "../componentes/mensagem-erro.js";
import { PrazosView } from "../visoes/PrazosView.js";
import { carregarAnimaisDoUsuario } from "../utilitarios/dados.js";

export interface DependenciasPrazos {
  listarAnimal: ListarAnimal;
  listarPrazos: ListarPrazos;
}

export class PrazosController {
  private readonly view = new PrazosView();
  private todos: PrazoDTO[] = [];
  private filtro = "todos";

  constructor(
    private readonly dependencias: DependenciasPrazos,
    private readonly propriedades: Propriedade[],
    private readonly tela: ContextoTela,
  ) {}

  async iniciar(): Promise<void> {
    try {
      const animais = await carregarAnimaisDoUsuario(
        this.dependencias.listarAnimal,
        this.propriedades,
      );
      const ids = animais.map((animal) => animal.id);
      this.todos = await this.dependencias.listarPrazos.executar(ids);
      this.renderizar();
    } catch (falha) {
      mostrarToast(descreverErro(falha), "erro");
    }
  }

  private renderizar(): void {
    const filtrados =
      this.filtro === "todos"
        ? this.todos
        : this.todos.filter((prazo) => prazo.status === this.filtro);

    const elemento = this.view.renderizar({
      prazos: filtrados,
      todos: this.todos,
      filtro: this.filtro,
    });
    montarNaTela(this.tela, elemento);

    ligarChips(elemento, (valor) => {
      this.filtro = valor;
      this.renderizar();
    });
  }
}
