export type TipoRegistroRecente =
  | "Pesagem"
  | "Vacinação"
  | "Medicamento"
  | "Reprodução"
  | "Nascimento"
  | "Morte"
  | "Alimentação";

export interface RegistroRecenteDTO {
  id: string;
  tipo: TipoRegistroRecente;
  titulo: string;
  descricao?: string;
  animalId?: string;
  animalNome?: string;
  data: string;
  icone: string;
}
