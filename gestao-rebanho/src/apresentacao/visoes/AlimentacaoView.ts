import { Alimento } from "../../dominio/entidades/Alimento.js";
import { UndMedida } from "../../dominio/enumeracoes/UndMedida.js";
import { hojeIso } from "../../dominio/utilitarios/datas.js";
import { cartao } from "../componentes/card.js";
import { escaparHtml, icone } from "../componentes/dom.js";
import { estadoVazio } from "../componentes/estado-vazio.js";
import {
  botaoPrimario,
  campoSelect,
  campoTexto,
  rodapeRegistro,
} from "../componentes/formulario.js";
import {
  formatarQuantidade,
  rotuloUnidade,
} from "../utilitarios/formatadores.js";

interface DadosLista {
  alimentos: Alimento[];
}

export class AlimentacaoView {
  lista(dados: DadosLista): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";

    const listaHtml =
      dados.alimentos.length === 0
        ? estadoVazio({
            icone: "espiga",
            titulo: "Nenhum alimento cadastrado",
            descricao:
              "Cadastre ração, silagem ou outro alimento para controlar o estoque.",
          })
        : `<div class="alimentos-cartao">${dados.alimentos
            .map(
              (alimento) => `
                <div class="alimento-item">
                  <span class="icone-caixa icone-caixa--areia">${icone("espiga")}</span>
                  <div class="alimento-dados">
                    <span class="alimento-nome">${escaparHtml(
                      alimento.nome,
                    )}</span>
                    <span class="alimento-disponivel">Disponível: ${escaparHtml(
                      formatarQuantidade(
                        alimento.quantidadeDisponivel,
                        alimento.unidade,
                      ),
                    )}</span>
                  </div>
                  <button
                    type="button"
                    class="botao-icone"
                    data-editar-alimento="${escaparHtml(alimento.id)}"
                    aria-label="Editar ${escaparHtml(alimento.nome)}"
                  >${icone("lapis")}</button>
                </div>
              `,
            )
            .join("")}</div>`;

    const consumoHtml =
      dados.alimentos.length === 0
        ? ""
        : cartao(
            `<div class="consumo-titulo">
              <h2 class="secao-titulo">Registrar consumo</h2>
              <small>A disponibilidade muda a cada consumo registrado.</small>
            </div>
            <form id="form-consumo" novalidate>
              <div id="erro-consumo" hidden></div>
              ${campoSelect({
                id: "alimento-consumo",
                label: "Alimento",
                obrigatorio: true,
                placeholder: "Selecione o alimento",
                opcoes: dados.alimentos.map((alimento) => ({
                  valor: alimento.id,
                  texto: `${alimento.nome} · ${formatarQuantidade(
                    alimento.quantidadeDisponivel,
                    alimento.unidade,
                  )} disponíveis`,
                })),
              })}
              ${campoTexto({
                id: "data-consumo",
                label: "Data",
                tipo: "date",
                obrigatorio: true,
                valor: hojeIso(),
                max: hojeIso(),
              })}
              ${campoTexto({
                id: "quantidade-consumo",
                label: "Quantidade consumida",
                tipo: "number",
                inputmode: "decimal",
                min: 0.1,
                step: 0.1,
                obrigatorio: true,
                placeholder: "Ex.: 10",
              })}
              ${botaoPrimario("Registrar consumo")}
            </form>`,
            "consumo-cartao",
          );

    elemento.innerHTML = `
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">Alimentação</h1>
        <p class="pagina-subtitulo">O alimento disponível e o consumo, sem complicação.</p>
      </div>

      <div class="secao-topo">
        <h2 class="secao-titulo">Alimentos cadastrados</h2>
        <button type="button" class="link" id="btn-novo-alimento">+ Cadastrar</button>
      </div>
      ${listaHtml}
      <p class="nota-alimentacao">A disponibilidade é atualizada a cada consumo registrado.</p>
      ${consumoHtml}
    `;
    return elemento;
  }

  formulario(alimento?: Alimento): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";
    const editando = Boolean(alimento);
    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">
        ${icone("voltar")} Voltar
      </button>
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">${
          editando ? "Editar alimento" : "Cadastrar alimento"
        }</h1>
        <p class="pagina-subtitulo">Mantenha o estoque de alimentos organizado.</p>
      </div>
      <form class="cartao form-cartao" id="form-alimento" novalidate>
        <div id="erro-form" hidden></div>
        ${campoTexto({
          id: "nome-alimento",
          label: "Nome do alimento",
          obrigatorio: true,
          valor: alimento?.nome ?? "",
          placeholder: "Ex.: Ração de engorda",
        })}
        ${campoSelect({
          id: "unidade-alimento",
          label: "Unidade",
          obrigatorio: true,
          placeholder: "Selecione",
          valor: alimento?.unidade ?? UndMedida.KG,
          opcoes: Object.values(UndMedida).map((unidade) => ({
            valor: unidade,
            texto: rotuloUnidade(unidade),
          })),
        })}
        ${campoTexto({
          id: "quantidade-alimento",
          label: "Quantidade disponível",
          tipo: "number",
          inputmode: "decimal",
          min: 0,
          step: 0.1,
          obrigatorio: true,
          valor:
            alimento !== undefined
              ? String(alimento.quantidadeDisponivel)
              : "",
          placeholder: "Ex.: 480",
        })}
        ${botaoPrimario("Salvar alimento")}
        ${rodapeRegistro()}
      </form>
    `;
    return elemento;
  }

  exibirErro(mensagem: string): void {
    const container =
      document.getElementById("erro-form") ??
      document.getElementById("erro-consumo");
    if (container) {
      container.innerHTML = `<div class="mensagem-erro">${escaparHtml(
        mensagem,
      )}</div>`;
      container.hidden = false;
      container.scrollIntoView({ block: "nearest" });
    }
  }
}
