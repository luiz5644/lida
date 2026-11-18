import { Manejo } from '../../../dominio/entidades/Manejo.js';
import type { IRepositorioManejo } from '../../../dominio/repositorios/IRepositorioManejo.js';
import type { IRepositorioAnimal } from '../../../dominio/repositorios/IRepositorioAnimal.js';
import type { IRepositorioLote } from '../../../dominio/repositorios/IRepositorioLote.js';
import { ErroDeDominio } from '../../../dominio/erros/ErroDeDominio.js';
import { StatusAnimal } from '../../../dominio/enumeracoes/StatusAnimal.js';
import { TipoManejo } from '../../../dominio/enumeracoes/TipoManejo.js';
import { adicionarDias } from '../../../dominio/utilitarios/datas.js';
import { DIAS_REFORCO_PADRAO } from '../../../dominio/constantes.js';

export interface DadosRegistrarVacinacao {
  modo: 'animal' | 'lote';
  animalId?: string;
  loteId?: string;
  nomeVacina: string;
  dataAplicacao: string;
}

export class RegistrarVacinacao {
  constructor(
    private readonly repositorioManejo: IRepositorioManejo,
    private readonly repositorioAnimal: IRepositorioAnimal,
    private readonly repositorioLote: IRepositorioLote,
  ) {}

  async executar(dados: DadosRegistrarVacinacao): Promise<Manejo | Manejo[]> {
    if (dados.modo === 'animal') {
      if (!dados.animalId) {
        throw new ErroDeDominio('Informe o animal para vacinação.');
      }
      const animal = await this.repositorioAnimal.buscarPorId(dados.animalId);
      if (!animal) {
        throw new ErroDeDominio('Animal não encontrado.');
      }
      if (animal.status === StatusAnimal.MORTO) {
        throw new ErroDeDominio('Não é possível vacinar um animal morto.');
      }
      const dataReforco = adicionarDias(dados.dataAplicacao, DIAS_REFORCO_PADRAO);
      const manejo = new Manejo({
        id: crypto.randomUUID(),
        tipo: TipoManejo.VACINACAO,
        animalId: dados.animalId,
        data: dados.dataAplicacao,
        nomeProduto: dados.nomeVacina,
        dataReforco,
      });
      return this.repositorioManejo.criar(manejo);
    }

    // modo = 'lote'
    if (!dados.loteId) {
      throw new ErroDeDominio('Informe o lote para vacinação.');
    }
    const lote = await this.repositorioLote.buscarPorId(dados.loteId);
    if (!lote) {
      throw new ErroDeDominio('Lote não encontrado.');
    }
    const animais = await this.repositorioAnimal.listarPorLote(dados.loteId);
    const ativos = animais.filter((a) => a.status === StatusAnimal.ATIVO);
    if (ativos.length === 0) {
      throw new ErroDeDominio('O lote não possui animais ativos.');
    }
    const dataReforco = adicionarDias(dados.dataAplicacao, DIAS_REFORCO_PADRAO);
    const manejos: Manejo[] = [];
    for (const animal of ativos) {
      const manejo = new Manejo({
        id: crypto.randomUUID(),
        tipo: TipoManejo.VACINACAO,
        animalId: animal.id,
        loteId: dados.loteId,
        data: dados.dataAplicacao,
        nomeProduto: dados.nomeVacina,
        dataReforco,
      });
      const criado = await this.repositorioManejo.criar(manejo);
      manejos.push(criado);
    }
    return manejos;
  }
}
