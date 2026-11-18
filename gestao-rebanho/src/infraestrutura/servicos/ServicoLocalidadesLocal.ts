import { Estado, IServicoLocalidades } from '../../dominio/servicos/IServicoLocalidades.js';

interface DadosLocalidades {
  estados: Estado[];
  municipios: Record<string, string[]>;
}

const DADOS_PADRAO: DadosLocalidades = {
  estados: [
    { uf: 'AC', nome: 'Acre' },
    { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AM', nome: 'Amazonas' },
    { uf: 'AP', nome: 'Amapá' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' },
    { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MT', nome: 'Mato Grosso' },
    { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'PI', nome: 'Piauí' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SE', nome: 'Sergipe' },
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'TO', nome: 'Tocantins' },
  ],
  municipios: {
    CE: [
      'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Sobral', 'Maracanaú',
      'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá', 'Pacatuba',
      'Russas', 'Crateús', 'Canindé', 'Tianguá', 'Aracati', 'Limoeiro do Norte',
      'Cascavel', 'Aquiraz', 'Horizonte',
    ],
  },
};

export class ServicoLocalidadesLocal implements IServicoLocalidades {
  private readonly dados: DadosLocalidades;

  constructor(dados?: DadosLocalidades) {
    this.dados = dados ?? DADOS_PADRAO;
  }

  async listarEstados(): Promise<Estado[]> {
    return this.dados.estados;
  }

  async listarMunicipios(uf: string): Promise<string[]> {
    return this.dados.municipios[uf.toUpperCase()] ?? [];
  }
}
