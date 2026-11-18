import { PrazoDTO } from "../../aplicacao/dtos/PrazoDTO.js";
import { StatusPrazo } from "../../dominio/enumeracoes/StatusPrazo.js";
import { avisoInfo } from "../componentes/aviso-info.js";
import { badgeStatusPrazo } from "../componentes/badge.js";
import { chipsFiltro, ChipFiltro } from "../componentes/chips-filtro.js";
import { escaparHtml, icone } from "../componentes/dom.js";
import { estadoVazio } from "../componentes/estado-vazio.js";
import {
  formatarData,
  rotuloStatusPrazo,
} from "../utilitarios/formatadores.js";

interface DadosPrazos {
  prazos: PrazoDTO[];
  todos: PrazoDTO[];
  filtro: string;
}

export class PrazosView {
  renderizar(dados: DadosPrazos): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";

    const contagem = (status: StatusPrazo): number =>
      dados.todos.filter((prazo) => prazo.status === status).length;

    const chips: ChipFiltro[] = [
      { valor: "todos", rotulo: "Todos", contagem: dados.todos.length },
      {
        valor: StatusPrazo.EM_ANDAMENTO,
        rotulo: "Em andamento",
        contagem: contagem(StatusPrazo.EM_ANDAMENTO),
      },
      {
        valor: StatusPrazo.VENCIDO,
        rotulo: "Vencidos",
        contagem: contagem(StatusPrazo.VENCIDO),
      },
      {
        valor: StatusPrazo.LIBERADO,
        rotulo: "Liberados",
        contagem: contagem(StatusPrazo.LIBERADO),
      },
    ];

    const listaHtml =
      dados.prazos.length === 0
        ? estadoVazio({
            icone: "calendario",
            titulo: "Nenhum prazo nesta categoria",
            descricao:
              dados.todos.length === 0
                ? "Registre medicamentos e vacinas para acompanhar carências e reforços."
                : "Troque o filtro para ver os outros prazos.",
          })
        : `<div class="prazos-lista">${dados.prazos
            .map((prazo) => {
              const origemCarencia = prazo.origem === "carencia";
              const corIcone = origemCarencia ? "icone-caixa--creme" : "icone-caixa--verde";
              return `
                <div class="prazo-card">
                  <div class="prazo-topo">
                    <div class="prazo-identificacao">
                      <span class="icone-caixa ${corIcone}">${icone(
                        origemCarencia ? "comprimido" : "seringa",
                      )}</span>
                      <div class="prazo-info-animal">
                        <span class="prazo-animal">${escaparHtml(prazo.animalNome)}</span>
                        <span class="prazo-tipo">${origemCarencia ? "Medicamento" : "Vacinação"}</span>
                      </div>
                    </div>
                    ${badgeStatusPrazo(prazo.status)}
                  </div>
                  <div class="prazo-descricao">${escaparHtml(prazo.descricao)}</div>
                  <div class="prazo-data-linha">
                    ${icone("calendario")}
                    <span>${formatarData(prazo.data)}</span>
                  </div>
                </div>
              `;
            })
            .join("")}</div>`;

    elemento.innerHTML = `
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">Prazos</h1>
        <p class="pagina-subtitulo">Acompanhe as carências e os cuidados com data marcada.</p>
      </div>

      ${avisoInfo(
        "Um cuidado de cada vez. As carências são calculadas a partir da aplicação e dos dias informados no produto.",
      )}

      ${chipsFiltro(chips, dados.filtro)}

      ${listaHtml}

      <p class="prazos-rodape-nota">Ordenados por data. Carências encerradas aparecem como liberadas.</p>
    `;
    return elemento;
  }

  rotuloFiltro(filtro: string): string {
    if (filtro === "todos") {
      return "Todos";
    }
    return rotuloStatusPrazo(filtro as StatusPrazo);
  }
}
