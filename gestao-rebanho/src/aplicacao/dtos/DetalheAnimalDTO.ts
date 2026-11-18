import { Animal, AnimalProps } from "../../dominio/entidades/Animal.js";

export interface HistoricoAnimalDTO {
  id: string;
  tipo: string;
  titulo?: string;
  descricao?: string;
  data: string;
  icone?: string;
}

export interface DetalheAnimalDTO {
  animal: Animal | AnimalProps;
  propriedadeNome: string;
  loteNome?: string;
  historico?: HistoricoAnimalDTO[];
  pesoAtual?: number | null;
  pesoAnterior?: number | null;
  variacaoPeso?: number | null;
}
