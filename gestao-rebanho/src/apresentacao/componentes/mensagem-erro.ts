import { escaparHtml, icone } from "./dom.js";

export function mensagemErro(mensagem: string | null): string {
  if (!mensagem) {
    return "";
  }
  return `<div class="mensagem-erro" role="alert">${icone(
    "informacao",
    "icone--pequeno",
  )}<span>${escaparHtml(mensagem)}</span></div>`;
}

export function exibirErro(
  container: HTMLElement | null,
  mensagem: string,
): void {
  if (!container) {
    return;
  }
  container.innerHTML = mensagemErro(mensagem);
  container.hidden = false;
}

export function limparMensagemErro(container: HTMLElement | null): void {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  container.hidden = true;
}

export function descreverErro(erro: unknown): string {
  if (erro instanceof Error && erro.message) {
    return erro.message;
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}
