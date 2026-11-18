import { Conteiner } from "./conteiner.js";
import { iniciarRoteador, navegar, Rota } from "./roteador.js";

import { montarAparelho } from "../apresentacao/componentes/aparelho.js";
import { BarraNavegacao } from "../apresentacao/componentes/barra-navegacao.js";
import { limpar } from "../apresentacao/componentes/dom.js";
import { fecharBottomSheet } from "../apresentacao/componentes/bottom-sheet.js";
import { ContextoTela } from "../apresentacao/visoes/VisaoLista.js";

import { InicioView } from "../apresentacao/visoes/InicioView.js";
import { InicioController } from "../apresentacao/controladores/InicioController.js";
import { MaisView } from "../apresentacao/visoes/MaisView.js";

import { PropriedadeView } from "../apresentacao/visoes/PropriedadeView.js";
import { PropriedadeController } from "../apresentacao/controladores/PropriedadeController.js";
import { AnimalView } from "../apresentacao/visoes/AnimalView.js";
import { AnimalController } from "../apresentacao/controladores/AnimalController.js";
import { PesagemView } from "../apresentacao/visoes/PesagemView.js";
import { PesagemController } from "../apresentacao/controladores/PesagemController.js";
import { ManejoView } from "../apresentacao/visoes/ManejoView.js";
import { ManejoController } from "../apresentacao/controladores/ManejoController.js";
import { AlimentacaoView } from "../apresentacao/visoes/AlimentacaoView.js";
import { AlimentacaoController } from "../apresentacao/controladores/AlimentacaoController.js";
import { CarenciaView } from "../apresentacao/visoes/CarenciaView.js";
import { CarenciaController } from "../apresentacao/controladores/CarenciaController.js";

const TITULOS: Record<Rota, string> = {
  inicio: "Início",
  animais: "Animais",
  pesagens: "Pesagens",
  manejos: "Manejos",
  mais: "Mais",
  propriedades: "Propriedades",
  alimentacao: "Alimentação",
  carencia: "Carência",
};

async function garantirUsuarioPadrao(conteiner: Conteiner): Promise<void> {
  try {
    const usuarios = await conteiner.casosDeUso.usuario.listar.executar();
    if (usuarios.length === 0) {
      await conteiner.casosDeUso.usuario.criar.executar({
        nome: "Administrador",
        email: "admin@gestao.local",
        senha: "admin",
      });
    }
  } catch (erro) {
    console.error("Não foi possível garantir o usuário padrão.", erro);
  }
}

async function iniciar(): Promise<void> {
  const destino = document.getElementById("app");
  if (!destino) {
    throw new Error("Contêiner #app não encontrado.");
  }

  const conteiner = new Conteiner();
  await garantirUsuarioPadrao(conteiner);

  const elementos = montarAparelho(destino);
  const barra = new BarraNavegacao();
  elementos.barra.appendChild(barra.elemento);

  const contexto: ContextoTela = {
    cabecalho: elementos.cabecalho,
    conteudo: elementos.conteudo,
    flutuantes: elementos.flutuantes,
  };

  const renderizarRota = async (rota: Rota): Promise<void> => {
    fecharBottomSheet();

    limpar(elementos.cabecalho);
    limpar(elementos.conteudo);
    limpar(elementos.flutuantes);
    elementos.conteudo.scrollTop = 0;

    barra.definirAtivo(rota);
    document.title = `${TITULOS[rota]} · Gestão de Rebanho`;

    switch (rota) {
      case "inicio": {
        const view = new InicioView(contexto);
        const controller = new InicioController(
          view,
          conteiner.casosDeUso.propriedade.listar,
          conteiner.casosDeUso.animal.listar,
          conteiner.casosDeUso.pesagem.listar,
          conteiner.casosDeUso.controleCarencia.listar,
        );
        await controller.iniciar();
        break;
      }
      case "animais": {
        const controller = new AnimalController(
          new AnimalView(contexto),
          conteiner.casosDeUso.animal.criar,
          conteiner.casosDeUso.animal.listar,
          conteiner.casosDeUso.animal.atualizar,
          conteiner.casosDeUso.animal.remover,
          conteiner.casosDeUso.propriedade.listar,
        );
        await controller.iniciar();
        break;
      }
      case "pesagens": {
        const controller = new PesagemController(
          new PesagemView(contexto),
          conteiner.casosDeUso.pesagem.criar,
          conteiner.casosDeUso.pesagem.listar,
          conteiner.casosDeUso.pesagem.atualizar,
          conteiner.casosDeUso.pesagem.remover,
          conteiner.casosDeUso.animal.listar,
        );
        await controller.iniciar();
        break;
      }
      case "manejos": {
        const controller = new ManejoController(
          new ManejoView(contexto),
          conteiner.casosDeUso.manejo.criar,
          conteiner.casosDeUso.manejo.listar,
          conteiner.casosDeUso.manejo.atualizar,
          conteiner.casosDeUso.manejo.remover,
          conteiner.casosDeUso.animal.listar,
        );
        await controller.iniciar();
        break;
      }
      case "mais": {
        new MaisView(contexto);
        break;
      }
      case "propriedades": {
        const controller = new PropriedadeController(
          new PropriedadeView(contexto, { aoVoltar: () => navegar("mais") }),
          conteiner.casosDeUso.propriedade.criar,
          conteiner.casosDeUso.propriedade.listar,
          conteiner.casosDeUso.propriedade.atualizar,
          conteiner.casosDeUso.propriedade.remover,
          conteiner.casosDeUso.usuario.listar,
        );
        await controller.iniciar();
        break;
      }
      case "alimentacao": {
        const controller = new AlimentacaoController(
          new AlimentacaoView(contexto, { aoVoltar: () => navegar("mais") }),
          conteiner.casosDeUso.alimento.criar,
          conteiner.casosDeUso.alimento.listar,
          conteiner.casosDeUso.alimento.atualizar,
          conteiner.casosDeUso.alimento.remover,
          conteiner.casosDeUso.registroAlimentar.criar,
          conteiner.casosDeUso.registroAlimentar.listar,
          conteiner.casosDeUso.registroAlimentar.atualizar,
          conteiner.casosDeUso.registroAlimentar.remover,
          conteiner.casosDeUso.animal.listar,
        );
        await controller.iniciar();
        break;
      }
      case "carencia": {
        const controller = new CarenciaController(
          new CarenciaView(contexto, { aoVoltar: () => navegar("mais") }),
          conteiner.casosDeUso.produtoSanitario.criar,
          conteiner.casosDeUso.produtoSanitario.listar,
          conteiner.casosDeUso.produtoSanitario.atualizar,
          conteiner.casosDeUso.produtoSanitario.remover,
          conteiner.casosDeUso.controleCarencia.criar,
          conteiner.casosDeUso.controleCarencia.listar,
          conteiner.casosDeUso.controleCarencia.atualizar,
          conteiner.casosDeUso.controleCarencia.remover,
          conteiner.casosDeUso.animal.listar,
        );
        await controller.iniciar();
        break;
      }
      default:
        break;
    }
  };

  iniciarRoteador((rota) => {
    void renderizarRota(rota);
  });
}

iniciar().catch((erro: unknown) => {
  console.error("Falha ao iniciar a aplicação.", erro);
});
