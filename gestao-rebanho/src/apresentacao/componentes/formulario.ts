import { escaparHtml } from "../componentes/dom.js";

export interface OpcaoSelect {
  valor: string;
  texto: string;
}

interface CampoTextoOpcoes {
  id: string;
  label: string;
  valor?: string;
  tipo?: string;
  obrigatorio?: boolean;
  placeholder?: string;
  ajuda?: string;
  inputmode?: "text" | "numeric" | "decimal" | "tel" | "email";
  min?: string | number;
  max?: string | number;
  step?: string | number;
  autocomplete?: string;
  desabilitado?: boolean;
  maxlength?: number;
  erro?: string;
}

interface CampoSelectOpcoes {
  id: string;
  label: string;
  opcoes: OpcaoSelect[];
  valor?: string;
  obrigatorio?: boolean;
  placeholder?: string;
  ajuda?: string;
  desabilitado?: boolean;
}

interface CampoTextareaOpcoes {
  id: string;
  label: string;
  valor?: string;
  obrigatorio?: boolean;
  placeholder?: string;
  ajuda?: string;
  linhas?: number;
  maxlength?: number;
}

function rotulo(
  id: string,
  label: string,
  obrigatorio?: boolean,
): string {
  return `<label class="campo-rotulo" for="${escaparHtml(id)}">${escaparHtml(
    label,
  )}${obrigatorio ? ' <span class="obrigatorio">*</span>' : ""}</label>`;
}

function ajuda(texto?: string): string {
  return texto
    ? `<p class="campo-ajuda">${escaparHtml(texto)}</p>`
    : "";
}

export function campoTexto(opcoes: CampoTextoOpcoes): string {
  const {
    id,
    label,
    valor = "",
    tipo = "text",
    obrigatorio,
    placeholder,
    inputmode,
    min,
    max,
    step,
    autocomplete,
    desabilitado,
    maxlength,
    erro,
  } = opcoes;
  return `
    <div class="campo${erro ? " campo--erro" : ""}">
      ${rotulo(id, label, obrigatorio)}
      <input
        class="campo-controle"
        id="${escaparHtml(id)}"
        name="${escaparHtml(id)}"
        type="${escaparHtml(tipo)}"
        value="${escaparHtml(valor)}"
        ${placeholder ? `placeholder="${escaparHtml(placeholder)}"` : ""}
        ${inputmode ? `inputmode="${inputmode}"` : ""}
        ${min !== undefined ? `min="${escaparHtml(min)}"` : ""}
        ${max !== undefined ? `max="${escaparHtml(max)}"` : ""}
        ${step !== undefined ? `step="${escaparHtml(step)}"` : ""}
        ${autocomplete ? `autocomplete="${escaparHtml(autocomplete)}"` : ""}
        ${maxlength !== undefined ? `maxlength="${maxlength}"` : ""}
        ${desabilitado ? "disabled" : ""}
      />
      ${ajuda(opcoes.ajuda)}
      ${erro ? `<p class="campo-erro">${escaparHtml(erro)}</p>` : ""}
    </div>
  `;
}

export function campoSelect(opcoes: CampoSelectOpcoes): string {
  const {
    id,
    label,
    opcoes: itens,
    valor = "",
    obrigatorio,
    placeholder,
    desabilitado,
  } = opcoes;
  const opcoesHtml = itens
    .map(
      (item) =>
        `<option value="${escaparHtml(item.valor)}"${
          item.valor === valor ? " selected" : ""
        }>${escaparHtml(item.texto)}</option>`,
    )
    .join("");
  return `
    <div class="campo">
      ${rotulo(id, label, obrigatorio)}
      <select
        class="campo-controle campo-controle--select"
        id="${escaparHtml(id)}"
        name="${escaparHtml(id)}"
        ${desabilitado ? "disabled" : ""}
      >
        <option value="">${escaparHtml(placeholder ?? "Selecione")}</option>
        ${opcoesHtml}
      </select>
      ${ajuda(opcoes.ajuda)}
    </div>
  `;
}

export function campoTextarea(opcoes: CampoTextareaOpcoes): string {
  const {
    id,
    label,
    valor = "",
    obrigatorio,
    placeholder,
    linhas = 3,
    maxlength,
  } = opcoes;
  return `
    <div class="campo">
      ${rotulo(id, label, obrigatorio)}
      <textarea
        class="campo-controle campo-controle--textarea"
        id="${escaparHtml(id)}"
        name="${escaparHtml(id)}"
        rows="${linhas}"
        ${placeholder ? `placeholder="${escaparHtml(placeholder)}"` : ""}
        ${maxlength !== undefined ? `maxlength="${maxlength}"` : ""}
      >${escaparHtml(valor)}</textarea>
      ${ajuda(opcoes.ajuda)}
    </div>
  `;
}

export function campoCheckbox(
  id: string,
  texto: string,
  obrigatorio = false,
  marcado = false,
): string {
  return `
    <label class="checkbox" for="${escaparHtml(id)}">
      <input type="checkbox" id="${escaparHtml(id)}" ${
        marcado ? "checked" : ""
      } />
      <span>${escaparHtml(texto)}${
        obrigatorio ? ' <span class="obrigatorio">*</span>' : ""
      }</span>
    </label>
    <p class="campo-erro" id="erro-${escaparHtml(id)}" hidden></p>
  `;
}

export function botaoPrimario(
  texto: string,
  opcoes: {
    tipo?: "button" | "submit";
    id?: string;
    classe?: string;
    perigo?: boolean;
    desabilitado?: boolean;
  } = {},
): string {
  const {
    tipo = "submit",
    id,
    classe = "",
    perigo,
    desabilitado,
  } = opcoes;
  return `
    <button
      type="${tipo}"
      class="botao botao--primario${
        perigo ? " botao--perigo" : ""
      } ${classe}"
      ${id ? `id="${escaparHtml(id)}"` : ""}
      ${desabilitado ? "disabled" : ""}
    >${escaparHtml(texto)}</button>
  `;
}

export function botaoSecundario(
  texto: string,
  opcoes: { tipo?: "button" | "submit"; id?: string; classe?: string } = {},
): string {
  return `
    <button
      type="${opcoes.tipo ?? "button"}"
      class="botao botao--secundario ${opcoes.classe ?? ""}"
      ${opcoes.id ? `id="${escaparHtml(opcoes.id)}"` : ""}
    >${escaparHtml(texto)}</button>
  `;
}

export function rodapeRegistro(): string {
  return `<p class="rodape-registro">Registro demonstrativo. Os dados ficam apenas nesta sessão.</p>`;
}

export function lerTexto(id: string): string {
  const elemento = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  return elemento?.value.trim() ?? "";
}

export function lerNumero(id: string): number {
  return Number(lerTexto(id).replace(",", "."));
}

export function lerMarcado(id: string): boolean {
  const elemento = document.getElementById(id) as HTMLInputElement | null;
  return elemento?.checked ?? false;
}
