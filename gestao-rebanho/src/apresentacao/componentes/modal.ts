export interface OpcoesModal {
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  perigo?: boolean;
}

export function confirmar(opcoes: OpcoesModal): Promise<boolean> {
  return new Promise((resolver) => {
    const sobreposicao = document.createElement("div");
    sobreposicao.className = "modal-sobreposicao";
    sobreposicao.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <h2 id="modal-titulo">${opcoes.titulo}</h2>
        <p>${opcoes.mensagem}</p>
        <div class="modal-acoes">
          <button type="button" class="botao botao--secundario" data-acao="cancelar">
            ${opcoes.textoCancelar ?? "Cancelar"}
          </button>
          <button type="button" class="botao botao--primario${
            opcoes.perigo ? " botao--perigo" : ""
          }" data-acao="confirmar">
            ${opcoes.textoConfirmar ?? "Confirmar"}
          </button>
        </div>
      </div>
    `;

    const finalizar = (resultado: boolean): void => {
      sobreposicao.remove();
      document.removeEventListener("keydown", aoTeclar);
      resolver(resultado);
    };

    const aoTeclar = (evento: KeyboardEvent): void => {
      if (evento.key === "Escape") {
        finalizar(false);
      }
    };

    sobreposicao.addEventListener("click", (evento) => {
      const alvo = evento.target as HTMLElement;
      if (alvo === sobreposicao) {
        finalizar(false);
      }
      const acao = alvo.closest<HTMLElement>("[data-acao]")?.dataset.acao;
      if (acao === "confirmar") {
        finalizar(true);
      }
      if (acao === "cancelar") {
        finalizar(false);
      }
    });

    document.addEventListener("keydown", aoTeclar);
    document.body.appendChild(sobreposicao);
    sobreposicao
      .querySelector<HTMLButtonElement>('[data-acao="cancelar"]')
      ?.focus();
  });
}
