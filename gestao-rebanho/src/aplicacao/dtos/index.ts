import type { Animal, AnimalProps } from '../../dominio/entidades/Animal.js';
import type { StatusPrazo } from '../../dominio/enumeracoes/StatusPrazo.js';

export * from './DetalheAnimalDTO.js';
export * from './EvolucaoPesoDTO.js';

export interface RegistroRecenteDTO {
  id: string;
  tipo: 'pesagem' | 'manejo' | 'alimentacao';
  descricao: string;
  animalNome: string;
  data: string;
  icone: string;
}

export interface PrazoDTO {
  id: string;
  animalNome: string;
  tipo: 'Medicamento' | 'Vacinação';
  descricao: string;
  data: string;
  status: StatusPrazo;
}

export interface AnimalResumoDTO {
  id: string;
  identificacao: string;
  especie: string;
  raca?: string;
  sexo: string;
  status: string;
  loteId?: string;
  loteNome?: string;
  finalidade: string;
}

export interface LoteResumoDTO {
  id: string;
  nome: string;
  finalidade?: string;
  totalAnimais: number;
}

export interface HistoricoItemDTO {
  id: string;
  tipo: string;
  data: string;
  descricao: string;
}
