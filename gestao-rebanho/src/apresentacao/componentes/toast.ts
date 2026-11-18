export type TipoToast = "sucesso" | "erro" | "info";

function obterContainer(): HTMLElement {
  let container = document.getElementById("toasts");
  if (!container) {
    container = document.createElement("div");
    container.id = "toasts";
    container.className = "toasts";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  return container;
}

export function mostrarToast(
  mensagem: string,
  tipo: TipoToast = "sucesso",
): void {
  const container = obterContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.setAttribute("role", tipo === "erro" ? "alert" : "status");
  toast.textContent = mensagem;
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("toast--saindo");
    window.setTimeout(() => toast.remove(), 220);
  }, 3200);
}
