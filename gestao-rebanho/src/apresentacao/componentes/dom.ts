const CARACTERES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escaparHtml(valor: unknown): string {
  return String(valor ?? "").replace(
    /[&<>"']/g,
    (caractere) => CARACTERES[caractere] ?? caractere,
  );
}

export function icone(nome: string, classe = ""): string {
  const classes = ["icone", classe].filter(Boolean).join(" ");
  return `<svg class="${classes}" aria-hidden="true" focusable="false"><use href="assets/icones.svg#${escaparHtml(
    nome,
  )}"></use></svg>`;
}

export function definirHtml(elemento: HTMLElement, html: string): void {
  elemento.innerHTML = html;
}

export function limpar(elemento: HTMLElement): void {
  elemento.replaceChildren();
}

export function consultar<T extends Element>(
  raiz: ParentNode,
  seletor: string,
): T {
  const elemento = raiz.querySelector<T>(seletor);
  if (!elemento) {
    throw new Error(`Elemento não encontrado: ${seletor}`);
  }
  return elemento;
}

export function consultarOpcional<T extends Element>(
  raiz: ParentNode,
  seletor: string,
): T | null {
  return raiz.querySelector<T>(seletor);
}

export function consultarTodos<T extends Element>(
  raiz: ParentNode,
  seletor: string,
): T[] {
  return Array.from(raiz.querySelectorAll<T>(seletor));
}

export function valorDe(id: string): string {
  const elemento = document.getElementById(id) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null;
  return elemento?.value.trim() ?? "";
}

export function numeroDe(id: string): number {
  const bruto = valorDe(id).replace(",", ".");
  return Number(bruto);
}

export function marcarAtivo(
  raiz: ParentNode,
  seletor: string,
  atributo: string,
  valor: string,
): void {
  consultarTodos<HTMLElement>(raiz, seletor).forEach((elemento) => {
    const ativo = elemento.getAttribute(atributo) === valor;
    elemento.classList.toggle("ativo", ativo);
    if (elemento instanceof HTMLButtonElement) {
      elemento.setAttribute("aria-pressed", ativo ? "true" : "false");
    }
  });
}
