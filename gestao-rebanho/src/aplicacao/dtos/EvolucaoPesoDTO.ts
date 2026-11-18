export interface PontoPesoDTO {
  data: string;
  pesoKg: number;
  peso?: number;
}

export interface EvolucaoPesoDTO {
  pesoAtual: number | null | undefined;
  pesoAnterior: number | null | undefined;
  variacao: number | null | undefined;
  pontos: Array<{ data: string; peso?: number; pesoKg?: number }>;
}
