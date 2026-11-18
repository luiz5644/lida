import { ClienteLocalStorage } from "../infraestrutura/armazenamento/ClienteLocalStorage.js";

import { RepositorioUsuarioLocalStorage } from "../infraestrutura/repositorios/RepositorioUsuarioLocalStorage.js";
import { RepositorioPropriedadeLocalStorage } from "../infraestrutura/repositorios/RepositorioPropriedadeLocalStorage.js";
import { RepositorioAnimalLocalStorage } from "../infraestrutura/repositorios/RepositorioAnimalLocalStorage.js";
import { RepositorioPesagemLocalStorage } from "../infraestrutura/repositorios/RepositorioPesagemLocalStorage.js";
import { RepositorioManejoLocalStorage } from "../infraestrutura/repositorios/RepositorioManejoLocalStorage.js";
import { RepositorioAlimentoLocalStorage } from "../infraestrutura/repositorios/RepositorioAlimentoLocalStorage.js";
import { RepositorioRegistroAlimentarLocalStorage } from "../infraestrutura/repositorios/RepositorioRegistroAlimentarLocalStorage.js";
import { RepositorioProdutoSanitarioLocalStorage } from "../infraestrutura/repositorios/RepositorioProdutoSanitarioLocalStorage.js";
import { RepositorioControleCarenciaLocalStorage } from "../infraestrutura/repositorios/RepositorioControleCarenciaLocalStorage.js";

import { IRepositorioUsuario } from "../dominio/repositorios/IRepositorioUsuario.js";
import { IRepositorioPropriedade } from "../dominio/repositorios/IRepositorioPropriedade.js";
import { IRepositorioAnimal } from "../dominio/repositorios/IRepositorioAnimal.js";
import { IRepositorioPesagem } from "../dominio/repositorios/IRepositorioPesagem.js";
import { IRepositorioManejo } from "../dominio/repositorios/IRepositorioManejo.js";
import { IRepositorioAlimento } from "../dominio/repositorios/IRepositorioAlimento.js";
import { IRepositorioRegistroAlimentar } from "../dominio/repositorios/IRepositorioRegistroAlimentar.js";
import { IRepositorioProdutoSanitario } from "../dominio/repositorios/IRepositorioProdutoSanitario.js";
import { IRepositorioControleCarencia } from "../dominio/repositorios/IRepositorioControleCarencia.js";

import { CriarUsuario } from "../aplicacao/casos-de-uso/usuario/CriarUsuario.js";
import { ListarUsuario } from "../aplicacao/casos-de-uso/usuario/ListarUsuario.js";
import { BuscarUsuario } from "../aplicacao/casos-de-uso/usuario/BuscarUsuario.js";
import { AtualizarUsuario } from "../aplicacao/casos-de-uso/usuario/AtualizarUsuario.js";
import { RemoverUsuario } from "../aplicacao/casos-de-uso/usuario/RemoverUsuario.js";

import { CriarPropriedade } from "../aplicacao/casos-de-uso/propriedade/CriarPropriedade.js";
import { ListarPropriedade } from "../aplicacao/casos-de-uso/propriedade/ListarPropriedade.js";
import { BuscarPropriedade } from "../aplicacao/casos-de-uso/propriedade/BuscarPropriedade.js";
import { AtualizarPropriedade } from "../aplicacao/casos-de-uso/propriedade/AtualizarPropriedade.js";
import { RemoverPropriedade } from "../aplicacao/casos-de-uso/propriedade/RemoverPropriedade.js";

import { CriarAnimal } from "../aplicacao/casos-de-uso/animal/CriarAnimal.js";
import { ListarAnimal } from "../aplicacao/casos-de-uso/animal/ListarAnimal.js";
import { BuscarAnimal } from "../aplicacao/casos-de-uso/animal/BuscarAnimal.js";
import { AtualizarAnimal } from "../aplicacao/casos-de-uso/animal/AtualizarAnimal.js";
import { RemoverAnimal } from "../aplicacao/casos-de-uso/animal/RemoverAnimal.js";

import { CriarPesagem } from "../aplicacao/casos-de-uso/pesagem/CriarPesagem.js";
import { ListarPesagem } from "../aplicacao/casos-de-uso/pesagem/ListarPesagem.js";
import { BuscarPesagem } from "../aplicacao/casos-de-uso/pesagem/BuscarPesagem.js";
import { AtualizarPesagem } from "../aplicacao/casos-de-uso/pesagem/AtualizarPesagem.js";
import { RemoverPesagem } from "../aplicacao/casos-de-uso/pesagem/RemoverPesagem.js";

import { CriarManejo } from "../aplicacao/casos-de-uso/manejo/CriarManejo.js";
import { ListarManejo } from "../aplicacao/casos-de-uso/manejo/ListarManejo.js";
import { BuscarManejo } from "../aplicacao/casos-de-uso/manejo/BuscarManejo.js";
import { AtualizarManejo } from "../aplicacao/casos-de-uso/manejo/AtualizarManejo.js";
import { RemoverManejo } from "../aplicacao/casos-de-uso/manejo/RemoverManejo.js";

import { CriarAlimento } from "../aplicacao/casos-de-uso/alimento/CriarAlimento.js";
import { ListarAlimento } from "../aplicacao/casos-de-uso/alimento/ListarAlimento.js";
import { BuscarAlimento } from "../aplicacao/casos-de-uso/alimento/BuscarAlimento.js";
import { AtualizarAlimento } from "../aplicacao/casos-de-uso/alimento/AtualizarAlimento.js";
import { RemoverAlimento } from "../aplicacao/casos-de-uso/alimento/RemoverAlimento.js";

import { CriarRegistroAlimentar } from "../aplicacao/casos-de-uso/registro-alimentar/CriarRegistroAlimentar.js";
import { ListarRegistroAlimentar } from "../aplicacao/casos-de-uso/registro-alimentar/ListarRegistroAlimentar.js";
import { BuscarRegistroAlimentar } from "../aplicacao/casos-de-uso/registro-alimentar/BuscarRegistroAlimentar.js";
import { AtualizarRegistroAlimentar } from "../aplicacao/casos-de-uso/registro-alimentar/AtualizarRegistroAlimentar.js";
import { RemoverRegistroAlimentar } from "../aplicacao/casos-de-uso/registro-alimentar/RemoverRegistroAlimentar.js";

import { CriarProdutoSanitario } from "../aplicacao/casos-de-uso/produto-sanitario/CriarProdutoSanitario.js";
import { ListarProdutoSanitario } from "../aplicacao/casos-de-uso/produto-sanitario/ListarProdutoSanitario.js";
import { BuscarProdutoSanitario } from "../aplicacao/casos-de-uso/produto-sanitario/BuscarProdutoSanitario.js";
import { AtualizarProdutoSanitario } from "../aplicacao/casos-de-uso/produto-sanitario/AtualizarProdutoSanitario.js";
import { RemoverProdutoSanitario } from "../aplicacao/casos-de-uso/produto-sanitario/RemoverProdutoSanitario.js";

import { CriarControleCarencia } from "../aplicacao/casos-de-uso/controle-carencia/CriarControleCarencia.js";
import { ListarControleCarencia } from "../aplicacao/casos-de-uso/controle-carencia/ListarControleCarencia.js";
import { BuscarControleCarencia } from "../aplicacao/casos-de-uso/controle-carencia/BuscarControleCarencia.js";
import { AtualizarControleCarencia } from "../aplicacao/casos-de-uso/controle-carencia/AtualizarControleCarencia.js";
import { RemoverControleCarencia } from "../aplicacao/casos-de-uso/controle-carencia/RemoverControleCarencia.js";

export interface CasosDeUsoUsuario {
  criar: CriarUsuario;
  listar: ListarUsuario;
  buscar: BuscarUsuario;
  atualizar: AtualizarUsuario;
  remover: RemoverUsuario;
}

export interface CasosDeUsoPropriedade {
  criar: CriarPropriedade;
  listar: ListarPropriedade;
  buscar: BuscarPropriedade;
  atualizar: AtualizarPropriedade;
  remover: RemoverPropriedade;
}

export interface CasosDeUsoAnimal {
  criar: CriarAnimal;
  listar: ListarAnimal;
  buscar: BuscarAnimal;
  atualizar: AtualizarAnimal;
  remover: RemoverAnimal;
}

export interface CasosDeUsoPesagem {
  criar: CriarPesagem;
  listar: ListarPesagem;
  buscar: BuscarPesagem;
  atualizar: AtualizarPesagem;
  remover: RemoverPesagem;
}

export interface CasosDeUsoManejo {
  criar: CriarManejo;
  listar: ListarManejo;
  buscar: BuscarManejo;
  atualizar: AtualizarManejo;
  remover: RemoverManejo;
}

export interface CasosDeUsoAlimento {
  criar: CriarAlimento;
  listar: ListarAlimento;
  buscar: BuscarAlimento;
  atualizar: AtualizarAlimento;
  remover: RemoverAlimento;
}

export interface CasosDeUsoRegistroAlimentar {
  criar: CriarRegistroAlimentar;
  listar: ListarRegistroAlimentar;
  buscar: BuscarRegistroAlimentar;
  atualizar: AtualizarRegistroAlimentar;
  remover: RemoverRegistroAlimentar;
}

export interface CasosDeUsoProdutoSanitario {
  criar: CriarProdutoSanitario;
  listar: ListarProdutoSanitario;
  buscar: BuscarProdutoSanitario;
  atualizar: AtualizarProdutoSanitario;
  remover: RemoverProdutoSanitario;
}

export interface CasosDeUsoControleCarencia {
  criar: CriarControleCarencia;
  listar: ListarControleCarencia;
  buscar: BuscarControleCarencia;
  atualizar: AtualizarControleCarencia;
  remover: RemoverControleCarencia;
}

export interface Repositorios {
  usuario: IRepositorioUsuario;
  propriedade: IRepositorioPropriedade;
  animal: IRepositorioAnimal;
  pesagem: IRepositorioPesagem;
  manejo: IRepositorioManejo;
  alimento: IRepositorioAlimento;
  registroAlimentar: IRepositorioRegistroAlimentar;
  produtoSanitario: IRepositorioProdutoSanitario;
  controleCarencia: IRepositorioControleCarencia;
}

export interface CasosDeUso {
  usuario: CasosDeUsoUsuario;
  propriedade: CasosDeUsoPropriedade;
  animal: CasosDeUsoAnimal;
  pesagem: CasosDeUsoPesagem;
  manejo: CasosDeUsoManejo;
  alimento: CasosDeUsoAlimento;
  registroAlimentar: CasosDeUsoRegistroAlimentar;
  produtoSanitario: CasosDeUsoProdutoSanitario;
  controleCarencia: CasosDeUsoControleCarencia;
}

export class Conteiner {
  readonly repositorios: Repositorios;
  readonly casosDeUso: CasosDeUso;

  constructor() {
    const cliente = new ClienteLocalStorage("gestao-rebanho");

    const repositorios: Repositorios = {
      usuario: new RepositorioUsuarioLocalStorage(cliente),
      propriedade: new RepositorioPropriedadeLocalStorage(cliente),
      animal: new RepositorioAnimalLocalStorage(cliente),
      pesagem: new RepositorioPesagemLocalStorage(cliente),
      manejo: new RepositorioManejoLocalStorage(cliente),
      alimento: new RepositorioAlimentoLocalStorage(cliente),
      registroAlimentar: new RepositorioRegistroAlimentarLocalStorage(cliente),
      produtoSanitario: new RepositorioProdutoSanitarioLocalStorage(cliente),
      controleCarencia: new RepositorioControleCarenciaLocalStorage(cliente),
    };

    this.repositorios = repositorios;

    this.casosDeUso = {
      usuario: {
        criar: new CriarUsuario(repositorios.usuario),
        listar: new ListarUsuario(repositorios.usuario),
        buscar: new BuscarUsuario(repositorios.usuario),
        atualizar: new AtualizarUsuario(repositorios.usuario),
        remover: new RemoverUsuario(repositorios.usuario),
      },
      propriedade: {
        criar: new CriarPropriedade(repositorios.propriedade),
        listar: new ListarPropriedade(repositorios.propriedade),
        buscar: new BuscarPropriedade(repositorios.propriedade),
        atualizar: new AtualizarPropriedade(repositorios.propriedade),
        remover: new RemoverPropriedade(
          repositorios.propriedade,
          repositorios.animal,
        ),
      },
      animal: {
        criar: new CriarAnimal(repositorios.animal),
        listar: new ListarAnimal(repositorios.animal),
        buscar: new BuscarAnimal(repositorios.animal),
        atualizar: new AtualizarAnimal(repositorios.animal),
        remover: new RemoverAnimal(repositorios.animal),
      },
      pesagem: {
        criar: new CriarPesagem(repositorios.pesagem),
        listar: new ListarPesagem(repositorios.pesagem),
        buscar: new BuscarPesagem(repositorios.pesagem),
        atualizar: new AtualizarPesagem(repositorios.pesagem),
        remover: new RemoverPesagem(repositorios.pesagem),
      },
      manejo: {
        criar: new CriarManejo(repositorios.manejo),
        listar: new ListarManejo(repositorios.manejo),
        buscar: new BuscarManejo(repositorios.manejo),
        atualizar: new AtualizarManejo(repositorios.manejo),
        remover: new RemoverManejo(repositorios.manejo),
      },
      alimento: {
        criar: new CriarAlimento(repositorios.alimento),
        listar: new ListarAlimento(repositorios.alimento),
        buscar: new BuscarAlimento(repositorios.alimento),
        atualizar: new AtualizarAlimento(repositorios.alimento),
        remover: new RemoverAlimento(repositorios.alimento),
      },
      registroAlimentar: {
        criar: new CriarRegistroAlimentar(repositorios.registroAlimentar),
        listar: new ListarRegistroAlimentar(repositorios.registroAlimentar),
        buscar: new BuscarRegistroAlimentar(repositorios.registroAlimentar),
        atualizar: new AtualizarRegistroAlimentar(
          repositorios.registroAlimentar,
        ),
        remover: new RemoverRegistroAlimentar(repositorios.registroAlimentar),
      },
      produtoSanitario: {
        criar: new CriarProdutoSanitario(repositorios.produtoSanitario),
        listar: new ListarProdutoSanitario(repositorios.produtoSanitario),
        buscar: new BuscarProdutoSanitario(repositorios.produtoSanitario),
        atualizar: new AtualizarProdutoSanitario(repositorios.produtoSanitario),
        remover: new RemoverProdutoSanitario(repositorios.produtoSanitario),
      },
      controleCarencia: {
        criar: new CriarControleCarencia(
          repositorios.controleCarencia,
          repositorios.produtoSanitario,
        ),
        listar: new ListarControleCarencia(repositorios.controleCarencia),
        buscar: new BuscarControleCarencia(repositorios.controleCarencia),
        atualizar: new AtualizarControleCarencia(
          repositorios.controleCarencia,
          repositorios.produtoSanitario,
        ),
        remover: new RemoverControleCarencia(repositorios.controleCarencia),
      },
    };
  }
}
