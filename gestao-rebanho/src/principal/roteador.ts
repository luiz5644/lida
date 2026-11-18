export const ROTAS = [
  "inicio",
  "animais",
  "pesagens",
  "manejos",
  "mais",
  "propriedades",
  "alimentacao",
  "carencia",
] as const;

export type Rota = (typeof ROTAS)[number];

export function lerRota(): Rota {
  const bruto = window.location.hash
    .replace(/^#\/?/, "")
    .split(/[/?]/)[0]
    .trim()
    .toLowerCase();

  return (ROTAS as readonly string[]).includes(bruto)
    ? (bruto as Rota)
    : "inicio";
}

export function navegar(rota: Rota): void {
  const alvo = `#/${rota}`;
  if (window.location.hash === alvo) {
    return;
  }
  window.location.hash = alvo;
}

export function iniciarRoteador(aoMudar: (rota: Rota) => void): void {
  if (!window.location.hash) {
    window.history.replaceState(null, "", "#/inicio");
  }

  window.addEventListener("hashchange", () => {
    aoMudar(lerRota());
  });

  aoMudar(lerRota());
}
