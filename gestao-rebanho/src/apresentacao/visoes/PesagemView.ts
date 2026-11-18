import { Animal } from "../../dominio/entidades/Animal.js";
import { hojeIso } from "../../dominio/utilitarios/datas.js";
import { escaparHtml } from "../componentes/dom.js";
import { estadoVazio } from "../componentes/estado-vazio.js";
import {
  botaoPrimario,
  campoSelect,
  campoTexto,
  rodapeRegistro,
} from "../componentes/formulario.js";

export class PesagemView {
  formulario(animais: Animal[], animalSelecionado = ""): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";
    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">← Voltar</button>
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">Registrar pesagem</h1>
        <p class="pagina-subtitulo">Acompanhe o desenvolvimento do seu animal.</p>
      </div>
      <form class="cartao" id="form-manejo" novalidate>
        <div id="erro-form" hidden></div>
        ${campoSelect({
          id: "animal-pesagem",
          label: "Animal",
          obrigatorio: true,
          placeholder: "Selecione o animal",
          valor: animalSelecionado,
          opcoes: animais.map((animal) => ({
            valor: animal.id,
            texto: animal.identificacao,
          })),
        })}
        ${campoTexto({
          id: "data-pesagem",
          label: "Data da pesagem",
          tipo: "date",
          obrigatorio: true,
          valor: hojeIso(),
          max: hojeIso(),
        })}
        ${campoTexto({
          id: "peso-pesagem",
          label: "Peso em kg",
          tipo: "number",
          inputmode: "decimal",
          min: 0.1,
          step: 0.1,
          obrigatorio: true,
          placeholder: "Ex.: 380,5",
        })}
        ${botaoPrimario("Registrar pesagem")}
        ${rodapeRegistro()}
      </form>
    `;
    return elemento;
  }

  semAnimais(): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";
    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">← Voltar</button>
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">Registrar pesagem</h1>
      </div>
      ${estadoVazio({
        icone: "rebanho",
        titulo: "Nenhum animal ativo",
        descricao:
          "Cadastre um animal ativo na propriedade para registrar a pesagem.",
        acaoHtml: `<button type="button" class="botao botao--primario" id="btn-adicionar-animal" style="margin-top: 8px;">+ Adicionar animal</button>`,
      })}
    `;
    return elemento;
  }

  exibirErro(mensagem: string): void {
    const container = document.getElementById("erro-form");
    if (container) {
      container.innerHTML = `<div class="campo-erro" style="margin-bottom: 12px;">${escaparHtml(
        mensagem,
      )}</div>`;
      container.hidden = false;
    }
  }
}
