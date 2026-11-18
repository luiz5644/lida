import { consultarTodos } from "./dom.js";

const QUANTIDADE_DIGITOS = 6;

export function campoCodigo(): string {
  return `
    <div class="campo-codigo" id="campo-codigo" role="group" aria-label="Código de acesso de 6 dígitos">
      ${Array.from({ length: QUANTIDADE_DIGITOS })
        .map(
          (_item, indice) => `
            <input
              class="codigo-digito"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="1"
              data-indice="${indice}"
              aria-label="Dígito ${indice + 1}"
            />
          `,
        )
        .join("")}
    </div>
  `;
}

export function obterCodigo(raiz: ParentNode): string {
  return consultarTodos<HTMLInputElement>(raiz, ".codigo-digito")
    .map((entrada) => entrada.value.replace(/\D/g, ""))
    .join("")
    .slice(0, QUANTIDADE_DIGITOS);
}

export function ligarCampoCodigo(
  raiz: ParentNode,
  aoCompletar: (codigo: string) => void,
): void {
  const entradas = consultarTodos<HTMLInputElement>(raiz, ".codigo-digito");
  if (entradas.length === 0) {
    return;
  }

  const avisarSeCompleto = (): void => {
    const codigo = obterCodigo(raiz);
    if (codigo.length === QUANTIDADE_DIGITOS) {
      aoCompletar(codigo);
    }
  };

  entradas.forEach((entrada, indice) => {
    entrada.addEventListener("input", () => {
      const digitos = entrada.value.replace(/\D/g, "");
      entrada.value = digitos.slice(-1);
      if (entrada.value && indice < entradas.length - 1) {
        entradas[indice + 1].focus();
        entradas[indice + 1].select();
      }
      avisarSeCompleto();
    });

    entrada.addEventListener("keydown", (evento) => {
      if (evento.key === "Backspace" && !entrada.value && indice > 0) {
        entradas[indice - 1].focus();
        entradas[indice - 1].value = "";
        evento.preventDefault();
      }
      if (evento.key === "ArrowLeft" && indice > 0) {
        entradas[indice - 1].focus();
      }
      if (evento.key === "ArrowRight" && indice < entradas.length - 1) {
        entradas[indice + 1].focus();
      }
    });

    entrada.addEventListener("paste", (evento) => {
      evento.preventDefault();
      const texto = (evento.clipboardData?.getData("text") ?? "").replace(
        /\D/g,
        "",
      );
      if (!texto) {
        return;
      }
      let posicao = indice;
      for (const digito of texto.slice(0, QUANTIDADE_DIGITOS - indice)) {
        if (posicao >= entradas.length) {
          break;
        }
        entradas[posicao].value = digito;
        posicao += 1;
      }
      const foco = Math.min(posicao, entradas.length - 1);
      entradas[foco].focus();
      avisarSeCompleto();
    });
  });

  entradas[0].focus();
}
