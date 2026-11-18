export interface Estado {
  uf: string;
  nome: string;
}

export interface IServicoLocalidades {
  listarEstados(): Promise<Estado[]>;
  listarMunicipios(uf: string): Promise<string[]>;
}
