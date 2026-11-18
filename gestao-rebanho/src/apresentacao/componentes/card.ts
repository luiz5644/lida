export function cartao(conteudo: string, classe = ""): string {
  return `<section class="cartao ${classe}">${conteudo}</section>`;
}

export function cartaoAcaoRapida(
  iconeHtml: string,
  titulo: string,
  descricao: string,
  atributoRota: string,
  classeIcone = "icone-caixa--azul",
): string {
  return `
    <button type="button" class="acao-rapida" ${atributoRota}>
      <div class="acao-rapida-topo">
        <span class="icone-caixa ${classeIcone}">${iconeHtml}</span>
        <span class="acao-rapida-seta">↗</span>
      </div>
      <span class="acao-rapida-texto">
        <strong>${titulo}</strong>
        <small>${descricao}</small>
      </span>
    </button>
  `;
}

export function itemLista(
  iconeHtml: string,
  titulo: string,
  subtitulo: string,
  detalhe: string,
  atributoRota?: string,
  classeIcone = "icone-caixa--azul",
): string {
  const conteudo = `
    <span class="icone-caixa icone-caixa--lista ${classeIcone}">${iconeHtml}</span>
    <span class="item-lista-texto">
      <strong>${titulo}</strong>
      <small>${subtitulo}</small>
    </span>
    <span class="item-lista-detalhe">
      <span>${detalhe}</span>
      <span class="chevron">›</span>
    </span>
  `;
  if (atributoRota) {
    return `<button type="button" class="item-lista" ${atributoRota}>${conteudo}</button>`;
  }
  return `<div class="item-lista">${conteudo}</div>`;
}
