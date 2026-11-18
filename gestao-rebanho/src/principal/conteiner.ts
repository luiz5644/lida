import { AtualizarAlimento } from "../aplicacao/casos-de-uso/alimento/AtualizarAlimento.js";
import { BuscarAlimento } from "../aplicacao/casos-de-uso/alimento/BuscarAlimento.js";
import { CriarAlimento } from "../aplicacao/casos-de-uso/alimento/CriarAlimento.js";
import { ListarAlimento } from "../aplicacao/casos-de-uso/alimento/ListarAlimento.js";
import { AtualizarAnimal } from "../aplicacao/casos-de-uso/animal/AtualizarAnimal.js";
import { BuscarAnimal } from "../aplicacao/casos-de-uso/animal/BuscarAnimal.js";
import { CriarAnimal } from "../aplicacao/casos-de-uso/animal/CriarAnimal.js";
import { ListarAnimal } from "../aplicacao/casos-de-uso/animal/ListarAnimal.js";
import { ListarHistoricoAnimal } from "../aplicacao/casos-de-uso/animal/ListarHistoricoAnimal.js";
import { ObterDetalheAnimal } from "../aplicacao/casos-de-uso/animal/ObterDetalheAnimal.js";
import { ObterEvolucaoPeso } from "../aplicacao/casos-de-uso/animal/ObterEvolucaoPeso.js";
import { ConfirmarCodigoAcesso } from "../aplicacao/casos-de-uso/autenticacao/ConfirmarCodigoAcesso.js";
import { EncerrarSessao } from "../aplicacao/casos-de-uso/autenticacao/EncerrarSessao.js";
import { EnviarCodigoAcesso } from "../aplicacao/casos-de-uso/autenticacao/EnviarCodigoAcesso.js";
import { IniciarSessaoUsuario } from "../aplicacao/casos-de-uso/autenticacao/IniciarSessaoUsuario.js";
import { ObterSessaoAtual } from "../aplicacao/casos-de-uso/autenticacao/ObterSessaoAtual.js";
import { ListarRegistrosRecentes } from "../aplicacao/casos-de-uso/inicio/ListarRegistrosRecentes.js";
import { ListarEstados } from "../aplicacao/casos-de-uso/localidade/ListarEstados.js";
import { ListarMunicipios } from "../aplicacao/casos-de-uso/localidade/ListarMunicipios.js";
import { AtualizarLote } from "../aplicacao/casos-de-uso/lote/AtualizarLote.js";
import { BuscarLote } from "../aplicacao/casos-de-uso/lote/BuscarLote.js";
import { CriarLote } from "../aplicacao/casos-de-uso/lote/CriarLote.js";
import { ListarAnimaisDoLote } from "../aplicacao/casos-de-uso/lote/ListarAnimaisDoLote.js";
import { ListarLote } from "../aplicacao/casos-de-uso/lote/ListarLote.js";
import { RegistrarMedicamento } from "../aplicacao/casos-de-uso/manejo/RegistrarMedicamento.js";
import { RegistrarMorte } from "../aplicacao/casos-de-uso/manejo/RegistrarMorte.js";
import { RegistrarNascimento } from "../aplicacao/casos-de-uso/manejo/RegistrarNascimento.js";
import { RegistrarReproducao } from "../aplicacao/casos-de-uso/manejo/RegistrarReproducao.js";
import { RegistrarVacinacao } from "../aplicacao/casos-de-uso/manejo/RegistrarVacinacao.js";
import { CriarPesagem } from "../aplicacao/casos-de-uso/pesagem/CriarPesagem.js";
import { ListarPrazos } from "../aplicacao/casos-de-uso/prazos/ListarPrazos.js";
import { CriarProdutoSanitario } from "../aplicacao/casos-de-uso/produto-sanitario/CriarProdutoSanitario.js";
import { ListarProdutoSanitario } from "../aplicacao/casos-de-uso/produto-sanitario/ListarProdutoSanitario.js";
import { CriarPropriedade } from "../aplicacao/casos-de-uso/propriedade/CriarPropriedade.js";
import { ListarPropriedade } from "../aplicacao/casos-de-uso/propriedade/ListarPropriedade.js";
import { CriarRegistroAlimentar } from "../aplicacao/casos-de-uso/registro-alimentar/CriarRegistroAlimentar.js";
import { CriarUsuario } from "../aplicacao/casos-de-uso/usuario/CriarUsuario.js";
import { IRepositorioAlimento } from "../dominio/repositorios/IRepositorioAlimento.js";
import { IRepositorioAnimal } from "../dominio/repositorios/IRepositorioAnimal.js";
import { IRepositorioControleCarencia } from "../dominio/repositorios/IRepositorioControleCarencia.js";
import { IRepositorioLote } from "../dominio/repositorios/IRepositorioLote.js";
import { IRepositorioManejo } from "../dominio/repositorios/IRepositorioManejo.js";
import { IRepositorioPesagem } from "../dominio/repositorios/IRepositorioPesagem.js";
import { IRepositorioProdutoSanitario } from "../dominio/repositorios/IRepositorioProdutoSanitario.js";
import { IRepositorioPropriedade } from "../dominio/repositorios/IRepositorioPropriedade.js";
import { IRepositorioRegistroAlimentar } from "../dominio/repositorios/IRepositorioRegistroAlimentar.js";
import { IRepositorioSessao } from "../dominio/repositorios/IRepositorioSessao.js";
import { IRepositorioUsuario } from "../dominio/repositorios/IRepositorioUsuario.js";
import { IServicoCodigoAcesso } from "../dominio/servicos/IServicoCodigoAcesso.js";
import { IServicoLocalidades } from "../dominio/servicos/IServicoLocalidades.js";

import { ClienteArmazenamentoSessao } from "../infraestrutura/armazenamento/ClienteArmazenamentoSessao.js";
import { RepositorioAlimentoSessao } from "../infraestrutura/repositorios/RepositorioAlimentoSessao.js";
import { RepositorioAnimalSessao } from "../infraestrutura/repositorios/RepositorioAnimalSessao.js";
import { RepositorioControleCarenciaSessao } from "../infraestrutura/repositorios/RepositorioControleCarenciaSessao.js";
import { RepositorioLoteSessao } from "../infraestrutura/repositorios/RepositorioLoteSessao.js";
import { RepositorioManejoSessao } from "../infraestrutura/repositorios/RepositorioManejoSessao.js";
import { RepositorioPesagemSessao } from "../infraestrutura/repositorios/RepositorioPesagemSessao.js";
import { RepositorioProdutoSanitarioSessao } from "../infraestrutura/repositorios/RepositorioProdutoSanitarioSessao.js";
import { RepositorioPropriedadeSessao } from "../infraestrutura/repositorios/RepositorioPropriedadeSessao.js";
import { RepositorioRegistroAlimentarSessao } from "../infraestrutura/repositorios/RepositorioRegistroAlimentarSessao.js";
import { RepositorioSessaoUsuarioSessao } from "../infraestrutura/repositorios/RepositorioSessaoUsuarioSessao.js";
import { RepositorioUsuarioSessao } from "../infraestrutura/repositorios/RepositorioUsuarioSessao.js";
import { ServicoCodigoAcessoSimulado } from "../infraestrutura/servicos/ServicoCodigoAcessoSimulado.js";
import { ServicoLocalidadesLocal } from "../infraestrutura/servicos/ServicoLocalidadesLocal.js";
import { semearDadosIniciais } from "../infraestrutura/seed/dadosIniciais.js";

export interface Repositorios {
  usuario: IRepositorioUsuario;
  sessao: IRepositorioSessao;
  propriedade: IRepositorioPropriedade;
  lote: IRepositorioLote;
  animal: IRepositorioAnimal;
  pesagem: IRepositorioPesagem;
  manejo: IRepositorioManejo;
  alimento: IRepositorioAlimento;
  registroAlimentar: IRepositorioRegistroAlimentar;
  produtoSanitario: IRepositorioProdutoSanitario;
  controleCarencia: IRepositorioControleCarencia;
}

export interface CasosDeUsoAutenticacao {
  enviarCodigo: EnviarCodigoAcesso;
  confirmarCodigo: ConfirmarCodigoAcesso;
  iniciarSessao: IniciarSessaoUsuario;
  obterSessao: ObterSessaoAtual;
  encerrarSessao: EncerrarSessao;
}

export interface CasosDeUso {
  autenticacao: CasosDeUsoAutenticacao;
  usuario: {
    criar: CriarUsuario;
  };
  propriedade: {
    criar: CriarPropriedade;
    listar: ListarPropriedade;
  };
  lote: {
    criar: CriarLote;
    listar: ListarLote;
    buscar: BuscarLote;
    atualizar: AtualizarLote;
    listarAnimais: ListarAnimaisDoLote;
  };
  animal: {
    criar: CriarAnimal;
    listar: ListarAnimal;
    buscar: BuscarAnimal;
    atualizar: AtualizarAnimal;
    obterDetalhe: ObterDetalheAnimal;
    obterEvolucao: ObterEvolucaoPeso;
    listarHistorico: ListarHistoricoAnimal;
  };
  pesagem: {
    criar: CriarPesagem;
  };
  manejo: {
    registrarVacinacao: RegistrarVacinacao;
    registrarMedicamento: RegistrarMedicamento;
    registrarReproducao: RegistrarReproducao;
    registrarNascimento: RegistrarNascimento;
    registrarMorte: RegistrarMorte;
  };
  alimento: {
    criar: CriarAlimento;
    listar: ListarAlimento;
    buscar: BuscarAlimento;
    atualizar: AtualizarAlimento;
  };
  registroAlimentar: {
    criar: CriarRegistroAlimentar;
  };
  produtoSanitario: {
    criar: CriarProdutoSanitario;
    listar: ListarProdutoSanitario;
  };
  inicio: {
    listarRegistrosRecentes: ListarRegistrosRecentes;
  };
  prazos: {
    listar: ListarPrazos;
  };
  localidade: {
    listarEstados: ListarEstados;
    listarMunicipios: ListarMunicipios;
  };
}

export class Conteiner {
  readonly repositorios: Repositorios;
  readonly casosDeUso: CasosDeUso;
  readonly servicos: {
    localidades: IServicoLocalidades;
    codigoAcesso: IServicoCodigoAcesso;
  };

  constructor() {
    const cliente = new ClienteArmazenamentoSessao("lida");
    const sessao = new RepositorioSessaoUsuarioSessao(cliente);

    const repositorios: Repositorios = {
      usuario: new RepositorioUsuarioSessao(cliente),
      sessao,
      propriedade: new RepositorioPropriedadeSessao(cliente),
      lote: new RepositorioLoteSessao(cliente),
      animal: new RepositorioAnimalSessao(cliente),
      pesagem: new RepositorioPesagemSessao(cliente),
      manejo: new RepositorioManejoSessao(cliente),
      alimento: new RepositorioAlimentoSessao(cliente),
      registroAlimentar: new RepositorioRegistroAlimentarSessao(cliente),
      produtoSanitario: new RepositorioProdutoSanitarioSessao(cliente),
      controleCarencia: new RepositorioControleCarenciaSessao(cliente),
    };

    const servicoLocalidades = new ServicoLocalidadesLocal();
    const servicoCodigoAcesso = new ServicoCodigoAcessoSimulado();
    const listarHistorico = new ListarHistoricoAnimal(
      repositorios.animal,
      repositorios.pesagem,
      repositorios.manejo,
      repositorios.controleCarencia,
    );

    this.repositorios = repositorios;
    this.servicos = {
      localidades: servicoLocalidades,
      codigoAcesso: servicoCodigoAcesso,
    };
    this.casosDeUso = {
      autenticacao: {
        enviarCodigo: new EnviarCodigoAcesso(
          repositorios.usuario,
          servicoCodigoAcesso,
          sessao,
        ),
        confirmarCodigo: new ConfirmarCodigoAcesso(
          repositorios.usuario,
          servicoCodigoAcesso,
          sessao,
        ),
        iniciarSessao: new IniciarSessaoUsuario(
          repositorios.usuario,
          sessao,
        ),
        obterSessao: new ObterSessaoAtual(repositorios.usuario, sessao),
        encerrarSessao: new EncerrarSessao(sessao),
      },
      usuario: {
        criar: new CriarUsuario(repositorios.usuario),
      },
      propriedade: {
        criar: new CriarPropriedade(repositorios.propriedade),
        listar: new ListarPropriedade(repositorios.propriedade),
      },
      lote: {
        criar: new CriarLote(repositorios.lote),
        listar: new ListarLote(repositorios.lote),
        buscar: new BuscarLote(repositorios.lote),
        atualizar: new AtualizarLote(repositorios.lote),
        listarAnimais: new ListarAnimaisDoLote(repositorios.animal),
      },
      animal: {
        criar: new CriarAnimal(repositorios.animal),
        listar: new ListarAnimal(repositorios.animal),
        buscar: new BuscarAnimal(repositorios.animal),
        atualizar: new AtualizarAnimal(repositorios.animal),
        obterDetalhe: new ObterDetalheAnimal(
          repositorios.animal,
          repositorios.lote,
          repositorios.propriedade,
          repositorios.pesagem,
        ),
        obterEvolucao: new ObterEvolucaoPeso(
          repositorios.animal,
          repositorios.pesagem,
        ),
        listarHistorico,
      },
      pesagem: {
        criar: new CriarPesagem(repositorios.pesagem, repositorios.animal),
      },
      manejo: {
        registrarVacinacao: new RegistrarVacinacao(
          repositorios.manejo,
          repositorios.animal,
          repositorios.lote,
        ),
        registrarMedicamento: new RegistrarMedicamento(
          repositorios.manejo,
          repositorios.animal,
          repositorios.controleCarencia,
          repositorios.produtoSanitario,
        ),
        registrarReproducao: new RegistrarReproducao(
          repositorios.manejo,
          repositorios.animal,
        ),
        registrarNascimento: new RegistrarNascimento(
          repositorios.manejo,
        ),
        registrarMorte: new RegistrarMorte(
          repositorios.manejo,
          repositorios.animal,
        ),
      },
      alimento: {
        criar: new CriarAlimento(repositorios.alimento),
        listar: new ListarAlimento(repositorios.alimento),
        buscar: new BuscarAlimento(repositorios.alimento),
        atualizar: new AtualizarAlimento(repositorios.alimento),
      },
      registroAlimentar: {
        criar: new CriarRegistroAlimentar(
          repositorios.registroAlimentar,
          repositorios.alimento,
        ),
      },
      produtoSanitario: {
        criar: new CriarProdutoSanitario(repositorios.produtoSanitario),
        listar: new ListarProdutoSanitario(repositorios.produtoSanitario),
      },
      inicio: {
        listarRegistrosRecentes: new ListarRegistrosRecentes(
          repositorios.pesagem,
          repositorios.manejo,
          repositorios.registroAlimentar,
          repositorios.animal,
          repositorios.alimento,
        ),
      },
      prazos: {
        listar: new ListarPrazos(
          repositorios.controleCarencia,
          repositorios.produtoSanitario,
          repositorios.manejo,
          repositorios.animal,
        ),
      },
      localidade: {
        listarEstados: new ListarEstados(servicoLocalidades),
        listarMunicipios: new ListarMunicipios(servicoLocalidades),
      },
    };
  }

  async garantirDadosIniciais(): Promise<void> {
    await semearDadosIniciais({
      usuario: this.repositorios.usuario,
      propriedade: this.repositorios.propriedade,
      lote: this.repositorios.lote,
      animal: this.repositorios.animal,
      pesagem: this.repositorios.pesagem,
      manejo: this.repositorios.manejo,
      alimento: this.repositorios.alimento,
      registroAlimentar: this.repositorios.registroAlimentar,
      produtoSanitario: this.repositorios.produtoSanitario,
      controleCarencia: this.repositorios.controleCarencia,
    });
  }
}
