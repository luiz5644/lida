export interface Rota {
  caminho: string;
  partes: string[];
  parametros: URLSearchParams;
}

const ROTA_INICIAL = "inicio";

function decodificar(valor: string): string {
  try {
    return decodeURIComponent(valor);
  } catch {
    return valor;
  }
}

export function lerRota(): Rota {
  const bruto = window.location.hash.replace(/^#/, "");
  const semBarra = bruto.replace(/^\/+/, "");
  const separador = semBarra.indexOf("?");
  const caminhoBruto =
    separador >= 0 ? semBarra.slice(0, separador) : semBarra;
  const consulta = separador >= 0 ? semBarra.slice(separador + 1) : "";
  const caminhoLimpo = caminhoBruto.replace(/\/+$/, "");
  const caminho = caminhoLimpo || ROTA_INICIAL;
  const partes = caminho
    .split("/")
    .filter(Boolean)
    .map(decodificar);

  return {
    caminho,
    partes,
    parametros: new URLSearchParams(consulta),
  };
}

export function navegar(caminho: string): void {
  const limpo = caminho.replace(/^#?\/?/, "").replace(/^\/+/, "");
  const alvo = `#/${limpo}`;
  if (window.location.hash === alvo) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  window.location.hash = alvo;
}

export function iniciarRoteador(aoMudar: (rota: Rota) => void): void {
  if (!window.location.hash) {
    window.history.replaceState(null, "", `#/${ROTA_INICIAL}`);
  }

  window.addEventListener("hashchange", () => {
    aoMudar(lerRota());
  });

  aoMudar(lerRota());
}
