import { formatarData } from "../utilitarios/formatadores.js";
import { escaparHtml } from "./dom.js";

export interface PontoGrafico {
  data: string;
  pesoKg: number;
}

export function graficoLinha(pontos: PontoGrafico[]): string {
  if (pontos.length === 0) {
    return `<div class="grafico-vazio">Ainda não há pesagens registradas.</div>`;
  }

  const largura = 320;
  const altura = 190;
  const margem = { esquerda: 38, direita: 14, topo: 16, base: 34 };
  const areaLargura = largura - margem.esquerda - margem.direita;
  const areaAltura = altura - margem.topo - margem.base;

  const ordenados = [...pontos].sort((a, b) => a.data.localeCompare(b.data));
  const pesos = ordenados.map((ponto) => ponto.pesoKg);
  const minimoBruto = Math.min(...pesos);
  const maximoBruto = Math.max(...pesos);
  const folga = Math.max(
    4,
    Math.round((maximoBruto - minimoBruto) * 0.15),
  );
  const minimo = Math.floor((minimoBruto - folga) / 5) * 5;
  const maximo = Math.ceil((maximoBruto + folga) / 5) * 5;
  const intervalo = Math.max(1, maximo - minimo);

  const coordenadaX = (indice: number): number => {
    if (ordenados.length === 1) {
      return margem.esquerda + areaLargura / 2;
    }
    return (
      margem.esquerda + (areaLargura * indice) / (ordenados.length - 1)
    );
  };

  const coordenadaY = (peso: number): number =>
    margem.topo + areaAltura * (1 - (peso - minimo) / intervalo);

  const caminho = ordenados
    .map(
      (ponto, indice) =>
        `${indice === 0 ? "M" : "L"} ${coordenadaX(indice).toFixed(1)} ${coordenadaY(
          ponto.pesoKg,
        ).toFixed(1)}`,
    )
    .join(" ");

  const linhasGrade = [0, 0.5, 1]
    .map((fracao) => {
      const valor = Math.round(minimo + intervalo * fracao);
      const y = coordenadaY(valor);
      return `
        <line x1="${margem.esquerda}" y1="${y}" x2="${largura - margem.direita}" y2="${y}" class="grafico-grade" />
        <text x="${margem.esquerda - 6}" y="${y + 3}" text-anchor="end" class="grafico-rotulo">${valor}</text>
      `;
    })
    .join("");

  const marcadores = ordenados
    .map((ponto, indice) => {
      const x = coordenadaX(indice);
      const y = coordenadaY(ponto.pesoKg);
      return `
        <circle cx="${x}" cy="${y}" r="4" class="grafico-ponto">
          <title>${formatarData(ponto.data)}: ${ponto.pesoKg} kg</title>
        </circle>
      `;
    })
    .join("");

  const primeiro = ordenados[0];
  const ultimo = ordenados[ordenados.length - 1];

  return `
    <div class="grafico">
      <svg viewBox="0 0 ${largura} ${altura}" role="img" aria-label="Evolução do peso do animal">
        ${linhasGrade}
        <path d="${caminho}" class="grafico-linha" />
        ${marcadores}
        <text x="${margem.esquerda}" y="${altura - 12}" class="grafico-rotulo" text-anchor="start">${escaparHtml(
          formatarData(primeiro.data),
        )}</text>
        <text x="${largura - margem.direita}" y="${altura - 12}" class="grafico-rotulo" text-anchor="end">${escaparHtml(
          formatarData(ultimo.data),
        )}</text>
      </svg>
    </div>
  `;
}
