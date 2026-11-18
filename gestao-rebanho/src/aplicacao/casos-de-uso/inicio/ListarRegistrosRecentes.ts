import { Animal } from "../../../dominio/entidades/Animal.js";
import { UndMedida } from "../../../dominio/enumeracoes/UndMedida.js";
import { TipoManejo } from "../../../dominio/enumeracoes/TipoManejo.js";
import { TipoOcorrenciaReproducao } from "../../../dominio/enumeracoes/TipoOcorrenciaReproducao.js";
import { QUANTIDADE_MAXIMA_REGISTROS_RECENTES } from "../../../dominio/constantes.js";
import { IRepositorioAlimento } from "../../../dominio/repositorios/IRepositorioAlimento.js";
import { IRepositorioAnimal } from "../../../dominio/repositorios/IRepositorioAnimal.js";
import { IRepositorioManejo } from "../../../dominio/repositorios/IRepositorioManejo.js";
import { IRepositorioPesagem } from "../../../dominio/repositorios/IRepositorioPesagem.js";
import { IRepositorioRegistroAlimentar } from "../../../dominio/repositorios/IRepositorioRegistroAlimentar.js";
import {
  RegistroRecenteDTO,
  TipoRegistroRecente,
} from "../../dtos/RegistroRecenteDTO.js";

function rotuloTipo(tipo: TipoManejo): TipoRegistroRecente {
  switch (tipo) {
    case TipoManejo.VACINACAO:
      return "Vacinação";
    case TipoManejo.MEDICAMENTO:
      return "Medicamento";
    case TipoManejo.REPRODUCAO:
      return "Reprodução";
    case TipoManejo.NASCIMENTO:
      return "Nascimento";
    case TipoManejo.MORTE:
      return "Morte";
  }
}

function iconeTipo(tipo: TipoManejo): string {
  switch (tipo) {
    case TipoManejo.VACINACAO:
      return "seringa";
    case TipoManejo.MEDICAMENTO:
      return "comprimido";
    case TipoManejo.REPRODUCAO:
      return "coracao";
    case TipoManejo.NASCIMENTO:
      return "carinha";
    case TipoManejo.MORTE:
      return "coracao-quebrado";
  }
}

function rotuloUnidade(unidade: UndMedida): string {
  switch (unidade) {
    case UndMedida.KG:
      return "kg";
    case UndMedida.G:
      return "g";
    case UndMedida.L:
      return "L";
    case UndMedida.ML:
      return "ml";
    case UndMedida.SACO:
      return "saco(s)";
  }
}

function rotuloOcorrencia(tipo: TipoOcorrenciaReproducao): string {
  switch (tipo) {
    case TipoOcorrenciaReproducao.COBERTURA:
      return "Cobertura";
    case TipoOcorrenciaReproducao.INSEMINACAO:
      return "Inseminação";
    case TipoOcorrenciaReproducao.DIAGNOSTICO_GESTACAO:
      return "Diagnóstico de gestação";
  }
}

export class ListarRegistrosRecentes {
  constructor(
    private readonly pesagens: IRepositorioPesagem,
    private readonly manejos: IRepositorioManejo,
    private readonly registros: IRepositorioRegistroAlimentar,
    private readonly animais: IRepositorioAnimal,
    private readonly alimentos: IRepositorioAlimento,
  ) {}

  async executar(animalIdsPermitidos?: string[]): Promise<RegistroRecenteDTO[]> {
    const [pesagens, manejos, registros, animais, alimentos] = await Promise.all([
      this.pesagens.listar(),
      this.manejos.listar(),
      this.registros.listar(),
      this.animais.listar(),
      this.alimentos.listar(),
    ]);

    const mapaAnimais = new Map<string, Animal>(
      animais.map((animal) => [animal.id, animal]),
    );
    const permitido = animalIdsPermitidos
      ? new Set(animalIdsPermitidos)
      : null;

    const incluirAnimal = (animalId?: string): boolean => {
      if (!permitido) {
        return true;
      }
      return !!animalId && permitido.has(animalId);
    };

    const itens: RegistroRecenteDTO[] = [];

    for (const pesagem of pesagens) {
      if (!incluirAnimal(pesagem.animalId)) {
        continue;
      }
      const animal = mapaAnimais.get(pesagem.animalId);
      itens.push({
        id: `pesagem:${pesagem.id}`,
        tipo: "Pesagem",
        titulo: "Pesagem",
        descricao: `${pesagem.pesoKg} kg`,
        animalId: pesagem.animalId,
        animalNome: animal?.identificacao ?? "Animal",
        data: pesagem.data,
        icone: "balanca",
      });
    }

    for (const manejo of manejos) {
      if (!incluirAnimal(manejo.animalId)) {
        continue;
      }
      const animal = manejo.animalId
        ? mapaAnimais.get(manejo.animalId)
        : undefined;
      const tipo = rotuloTipo(manejo.tipo);

      let descricao: string | undefined;
      if (manejo.tipo === TipoManejo.VACINACAO) {
        descricao = manejo.nomeProduto;
      } else if (manejo.tipo === TipoManejo.MEDICAMENTO) {
        descricao = manejo.nomeProduto ?? manejo.descricao;
      } else if (manejo.tipo === TipoManejo.REPRODUCAO) {
        descricao = manejo.tipoOcorrencia
          ? rotuloOcorrencia(manejo.tipoOcorrencia)
          : manejo.descricao;
      } else if (manejo.tipo === TipoManejo.NASCIMENTO) {
        descricao = manejo.descricao ?? "Nascimento registrado";
      } else {
        descricao = manejo.descricao ?? "Animal registrado como morto";
      }

      itens.push({
        id: `manejo:${manejo.id}`,
        tipo,
        titulo: tipo,
        descricao,
        animalId: manejo.animalId,
        animalNome: animal?.identificacao,
        data: manejo.data,
        icone: iconeTipo(manejo.tipo),
      });
    }

    for (const registro of registros) {
      if (!incluirAnimal(registro.animalId)) {
        continue;
      }
      const alimento = alimentos.find((item) => item.id === registro.alimentoId);
      const animal = registro.animalId
        ? mapaAnimais.get(registro.animalId)
        : undefined;
      itens.push({
        id: `registro:${registro.id}`,
        tipo: "Alimentação",
        titulo: "Alimentação",
        descricao: alimento
          ? `${registro.quantidade} ${rotuloUnidade(alimento.unidade)} · ${alimento.nome}`
          : `${registro.quantidade} de alimento`,
        animalId: registro.animalId,
        animalNome: animal?.identificacao ?? "Rebanho",
        data: registro.data,
        icone: "espiga",
      });
    }

    return itens
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, QUANTIDADE_MAXIMA_REGISTROS_RECENTES);
  }
}
