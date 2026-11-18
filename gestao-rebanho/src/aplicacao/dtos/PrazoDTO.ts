import { StatusPrazo } from "../../dominio/enumeracoes/StatusPrazo.js";

export type OrigemPrazo = "carencia" | "reforco";

export interface PrazoDTO {
  id: string;
  origem: OrigemPrazo;
  animalId: string;
  animalNome: string;
  tipo: "Medicamento" | "Vacinação";
  descricao: string;
  data: string;
  status: StatusPrazo;
}
