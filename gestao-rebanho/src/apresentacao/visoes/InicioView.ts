import { cartaoAcaoRapida, itemLista } from "../componentes/card.js";
import { escaparHtml, icone } from "../componentes/dom.js";
import { estadoVazio } from "../componentes/estado-vazio.js";
import { RegistroRecenteDTO } from "../../aplicacao/dtos/RegistroRecenteDTO.js";
import {
  formatarData,
  formatarDataExtensa,
  saudacao,
} from "../utilitarios/formatadores.js";

interface DadosInicio {
  nomeUsuario: string;
  registros: RegistroRecenteDTO[];
}

function corIconePorTipo(tipo: string): string {
  const t = tipo.toLowerCase();
  if (t.includes("pesagem") || t.includes("balanca")) return "icone-caixa--azul";
  if (t.includes("vacinacao") || t.includes("seringa")) return "icone-caixa--verde";
  if (t.includes("medicamento") || t.includes("comprimido")) return "icone-caixa--creme";
  if (t.includes("alimentacao") || t.includes("espiga")) return "icone-caixa--areia";
  if (t.includes("morte")) return "icone-caixa--rosa";
  return "icone-caixa--verde";
}

export class InicioView {
  renderizar(dados: DadosInicio): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";

    const registrosHtml =
      dados.registros.length === 0
        ? estadoVazio({
            icone: "prancheta",
            titulo: "Nenhum registro recente",
            descricao: "Os últimos manejos, pesagens e consumos aparecerão aqui.",
          })
        : `<div class="lista-cartao">${dados.registros
            .map((registro) => {
              const cor = corIconePorTipo(registro.tipo || registro.icone);
              const iconeNome = registro.icone || "prancheta";
              return itemLista(
                icone(iconeNome),
                registro.titulo ?? "Manejo",
                registro.animalNome ?? "Rebanho",
                formatarData(registro.data),
                registro.animalId
                  ? `data-animal="${escaparHtml(registro.animalId)}"`
                  : undefined,
                cor,
              );
            })
            .join("")}</div>`;

    elemento.innerHTML = `
      <div class="inicio-cabecalho">
        <h1 class="inicio-saudacao">${saudacao()}! <span>👋</span></h1>
        <p class="inicio-pergunta">O que vamos registrar hoje?</p>
        <div class="inicio-data-linha">
          ${icone("calendario")}
          <span>${escaparHtml(formatarDataExtensa())}</span>
        </div>
      </div>

      <section class="secao-acesso-rapido">
        <h2 class="secao-titulo">Acesso rápido</h2>
        <div class="grade-acoes">
          ${cartaoAcaoRapida(
            icone("balanca"),
            "Pesagem",
            "Registrar peso",
            'data-rota="manejos/pesagem"',
            "icone-caixa--azul",
          )}
          ${cartaoAcaoRapida(
            icone("seringa"),
            "Vacinação",
            "Cuidar da prevenção",
            'data-rota="manejos/vacinacao"',
            "icone-caixa--verde",
          )}
          ${cartaoAcaoRapida(
            icone("comprimido"),
            "Medicamento",
            "Registrar tratamento",
            'data-rota="manejos/medicamento"',
            "icone-caixa--creme",
          )}
          ${cartaoAcaoRapida(
            icone("espiga"),
            "Alimentação",
            "Registrar consumo",
            'data-rota="alimentacao"',
            "icone-caixa--areia",
          )}
        </div>
      </section>

      <section class="secao-recentes">
        <div class="recentes-topo">
          <h2 class="secao-titulo">Registros recentes</h2>
          <small>Últimos ${dados.registros.length} registros</small>
        </div>
        ${registrosHtml}
      </section>
    `;

    return elemento;
  }
}
