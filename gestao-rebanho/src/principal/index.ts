import { Propriedade } from "../dominio/entidades/Propriedade.js";
import { Usuario } from "../dominio/entidades/Usuario.js";
import { montarAparelho } from "../apresentacao/componentes/aparelho.js";
import { BarraNavegacao } from "../apresentacao/componentes/barra-navegacao.js";
import { CabecalhoApp } from "../apresentacao/componentes/cabecalho.js";
import { descreverErro } from "../apresentacao/componentes/mensagem-erro.js";
import { mostrarToast } from "../apresentacao/componentes/toast.js";
import { ContextoTela } from "../apresentacao/contexto.js";
import { AlimentacaoController } from "../apresentacao/controladores/AlimentacaoController.js";
import { AutenticacaoController } from "../apresentacao/controladores/AutenticacaoController.js";
import { InicioController } from "../apresentacao/controladores/InicioController.js";
import { ManejoController } from "../apresentacao/controladores/ManejoController.js";
import { OnboardingController } from "../apresentacao/controladores/OnboardingController.js";
import { PesagemController } from "../apresentacao/controladores/PesagemController.js";
import { PrazosController } from "../apresentacao/controladores/PrazosController.js";
import { RebanhoController } from "../apresentacao/controladores/RebanhoController.js";
import { Conteiner } from "./conteiner.js";
import { iniciarRoteador, lerRota, navegar, Rota } from "./roteador.js";

const ROTAS_AUTENTICACAO = new Set([
  "boas-vindas",
  "entrar",
  "confirmar-codigo",
  "criar-conta",
]);

const TIPOS_MANEJO = new Set([
  "vacinacao",
  "medicamento",
  "produto-sanitario",
  "reproducao",
  "nascimento",
  "morte",
]);

const TITULOS: Record<string, string> = {
  "boas-vindas": "Boas-vindas",
  entrar: "Entrar",
  "confirmar-codigo": "Confirmar código",
  "criar-conta": "Criar conta",
  onboarding: "Primeiros passos",
  inicio: "Início",
  rebanho: "Rebanho",
  manejos: "Manejos",
  alimentacao: "Alimentação",
  prazos: "Prazos",
};

function tituloDaRota(rota: Rota): string {
  const caminho = rota.partes[0] ?? "inicio";
  if (caminho === "rebanho" && rota.partes[1] === "animal") {
    if (rota.partes[2] === "novo") {
      return "Novo animal";
    }
    if (rota.partes[2] === "editar") {
      return "Editar animal";
    }
    return "Detalhe do animal";
  }
  if (caminho === "rebanho" && rota.partes[1] === "lote") {
    if (rota.partes[2] === "novo") {
      return "Novo lote";
    }
    if (rota.partes[2] === "editar") {
      return "Editar lote";
    }
    return "Detalhe do lote";
  }
  if (caminho === "manejos" && rota.partes[1]) {
    return TITULOS.manejos;
  }
  if (caminho === "alimentacao" && rota.partes[1]) {
    return "Alimentação";
  }
  return TITULOS[caminho] ?? "lida.";
}

async function iniciar(): Promise<void> {
  const destino = document.getElementById("app");
  if (!destino) {
    throw new Error("Contêiner #app não encontrado.");
  }

  const conteiner = new Conteiner();
  await conteiner.garantirDadosIniciais();

  const elementos = montarAparelho(destino);
  const cabecalho = new CabecalhoApp(() => navegar("inicio"));
  const barra = new BarraNavegacao((rota) => navegar(rota));
  elementos.cabecalho.appendChild(cabecalho.elemento);
  elementos.navegacao.appendChild(barra.elemento);

  const contexto: ContextoTela = {
    conteudo: elementos.conteudo,
    flutuantes: elementos.flutuantes,
    navegar,
    recarregar: () => {
      void renderizarRota(lerRota());
    },
  };

  async function renderizarRota(rota: Rota): Promise<void> {
    const caminho = rota.partes[0] ?? "inicio";
    const ehOnboarding = caminho === "onboarding";
    const ehAutenticacao =
      ROTAS_AUTENTICACAO.has(caminho) || ehOnboarding;

    cabecalho.definirVisivel(!ehAutenticacao);
    barra.definirVisivel(!ehAutenticacao);
    elementos.cabecalho.hidden = ehAutenticacao;
    elementos.navegacao.hidden = ehAutenticacao;
    elementos.tela.classList.toggle("tela--auth", ehAutenticacao);
    elementos.flutuantes.replaceChildren();

    if (!ehAutenticacao) {
      const ativo =
        caminho === "inicio" ||
        caminho === "rebanho" ||
        caminho === "manejos" ||
        caminho === "prazos"
          ? caminho
          : null;
      barra.definirAtivo(ativo);
    } else {
      barra.definirAtivo(null);
    }

    document.title = `${tituloDaRota(rota)} · lida.`;

    try {
      const sessaoAtual =
        await conteiner.casosDeUso.autenticacao.obterSessao.executar();
      const usuario: Usuario | null = sessaoAtual;
      let propriedades: Propriedade[] = [];

      if (usuario) {
        propriedades =
          await conteiner.casosDeUso.propriedade.listar.executar(usuario.id);
      }

      if (ehOnboarding) {
        if (!usuario) {
          navegar("boas-vindas");
          return;
        }
        const controller = new OnboardingController(
          {
            criarPropriedade: conteiner.casosDeUso.propriedade.criar,
            criarAnimal: conteiner.casosDeUso.animal.criar,
            criarLote: conteiner.casosDeUso.lote.criar,
            listarLote: conteiner.casosDeUso.lote.listar,
            listarEstados: conteiner.casosDeUso.localidade.listarEstados,
            listarMunicipios:
              conteiner.casosDeUso.localidade.listarMunicipios,
          },
          usuario,
          propriedades,
          contexto,
        );
        await controller.iniciar();
        return;
      }

      if (ROTAS_AUTENTICACAO.has(caminho)) {
        const controller = new AutenticacaoController(
          {
            enviarCodigo: conteiner.casosDeUso.autenticacao.enviarCodigo,
            confirmarCodigo:
              conteiner.casosDeUso.autenticacao.confirmarCodigo,
            criarUsuario: conteiner.casosDeUso.usuario.criar,
            iniciarSessao:
              conteiner.casosDeUso.autenticacao.iniciarSessao,
            sessao: conteiner.repositorios.sessao,
          },
          contexto,
        );

        switch (caminho) {
          case "boas-vindas":
            controller.boasVindas();
            return;
          case "entrar":
            controller.entrar();
            return;
          case "confirmar-codigo":
            controller.confirmarCodigo();
            return;
          case "criar-conta":
            controller.criarConta();
            return;
          default:
            navegar("boas-vindas");
            return;
        }
      }

      if (!usuario) {
        navegar("boas-vindas");
        return;
      }

      if (propriedades.length === 0) {
        navegar("onboarding");
        return;
      }

      switch (caminho) {
        case "inicio": {
          const controller = new InicioController(
            {
              listarAnimal: conteiner.casosDeUso.animal.listar,
              listarRegistrosRecentes:
                conteiner.casosDeUso.inicio.listarRegistrosRecentes,
            },
            usuario,
            propriedades,
            contexto,
          );
          await controller.iniciar();
          return;
        }
        case "rebanho": {
          const controller = new RebanhoController(
            {
              listarAnimal: conteiner.casosDeUso.animal.listar,
              buscarAnimal: conteiner.casosDeUso.animal.buscar,
              criarAnimal: conteiner.casosDeUso.animal.criar,
              atualizarAnimal: conteiner.casosDeUso.animal.atualizar,
              listarLote: conteiner.casosDeUso.lote.listar,
              buscarLote: conteiner.casosDeUso.lote.buscar,
              criarLote: conteiner.casosDeUso.lote.criar,
              atualizarLote: conteiner.casosDeUso.lote.atualizar,
              listarAnimaisDoLote:
                conteiner.casosDeUso.lote.listarAnimais,
              obterDetalheAnimal:
                conteiner.casosDeUso.animal.obterDetalhe,
              obterEvolucaoPeso:
                conteiner.casosDeUso.animal.obterEvolucao,
              listarHistoricoAnimal:
                conteiner.casosDeUso.animal.listarHistorico,
            },
            propriedades,
            contexto,
          );

          const secao = rota.partes[1];
          if (!secao) {
            await controller.iniciarLista();
            return;
          }
          if (secao === "animal") {
            const acao = rota.partes[2];
            if (!acao) {
              await controller.iniciarLista();
              return;
            }
            if (acao === "novo") {
              await controller.iniciarNovoAnimal({
                propriedadeId:
                  rota.parametros.get("propriedadeId") ?? undefined,
                loteId: rota.parametros.get("loteId") ?? undefined,
              });
              return;
            }
            if (acao === "editar") {
              const id = rota.partes[3];
              if (id) {
                await controller.iniciarEditarAnimal(id);
                return;
              }
              navegar("rebanho");
              return;
            }
            await controller.iniciarDetalheAnimal(acao);
            return;
          }
          if (secao === "lote") {
            const acao = rota.partes[2];
            if (!acao) {
              await controller.iniciarLista();
              return;
            }
            if (acao === "novo") {
              controller.iniciarNovoLote();
              return;
            }
            if (acao === "editar") {
              const id = rota.partes[3];
              if (id) {
                await controller.iniciarEditarLote(id);
                return;
              }
              navegar("rebanho");
              return;
            }
            await controller.iniciarDetalheLote(acao);
            return;
          }
          await controller.iniciarLista();
          return;
        }
        case "manejos": {
          const controller = new ManejoController(
            {
              listarAnimal: conteiner.casosDeUso.animal.listar,
              listarLote: conteiner.casosDeUso.lote.listar,
              listarProdutoSanitario:
                conteiner.casosDeUso.produtoSanitario.listar,
              criarProdutoSanitario:
                conteiner.casosDeUso.produtoSanitario.criar,
              registrarVacinacao:
                conteiner.casosDeUso.manejo.registrarVacinacao,
              registrarMedicamento:
                conteiner.casosDeUso.manejo.registrarMedicamento,
              registrarReproducao:
                conteiner.casosDeUso.manejo.registrarReproducao,
              registrarNascimento:
                conteiner.casosDeUso.manejo.registrarNascimento,
              registrarMorte:
                conteiner.casosDeUso.manejo.registrarMorte,
            },
            propriedades,
            contexto,
          );

          const secao = rota.partes[1];
          if (!secao) {
            controller.iniciarHub();
            return;
          }
          if (secao === "pesagem") {
            const pesagem = new PesagemController(
              {
                listarAnimal: conteiner.casosDeUso.animal.listar,
                criarPesagem: conteiner.casosDeUso.pesagem.criar,
              },
              propriedades,
              contexto,
            );
            await pesagem.iniciar(
              rota.parametros.get("animalId") ?? undefined,
            );
            return;
          }
          if (TIPOS_MANEJO.has(secao)) {
            await controller.iniciarFormulario(
              secao as
                | "vacinacao"
                | "medicamento"
                | "produto-sanitario"
                | "reproducao"
                | "nascimento"
                | "morte",
            );
            return;
          }
          navegar("manejos");
          return;
        }
        case "alimentacao": {
          const controller = new AlimentacaoController(
            {
              listarAlimento: conteiner.casosDeUso.alimento.listar,
              criarAlimento: conteiner.casosDeUso.alimento.criar,
              atualizarAlimento: conteiner.casosDeUso.alimento.atualizar,
              buscarAlimento: conteiner.casosDeUso.alimento.buscar,
              criarRegistroAlimentar:
                conteiner.casosDeUso.registroAlimentar.criar,
            },
            contexto,
          );

          const secao = rota.partes[1];
          if (secao === "novo") {
            controller.iniciarNovo();
            return;
          }
          if (secao === "editar") {
            const id = rota.partes[2];
            if (id) {
              await controller.iniciarEditar(id);
              return;
            }
            navegar("alimentacao");
            return;
          }
          await controller.iniciarLista();
          return;
        }
        case "prazos": {
          const controller = new PrazosController(
            {
              listarAnimal: conteiner.casosDeUso.animal.listar,
              listarPrazos: conteiner.casosDeUso.prazos.listar,
            },
            propriedades,
            contexto,
          );
          await controller.iniciar();
          return;
        }
        default:
          navegar("inicio");
          return;
      }
    } catch (falha) {
      console.error("Não foi possível renderizar a rota.", falha);
      mostrarToast(descreverErro(falha), "erro");
      navegar("inicio");
    }
  }

  iniciarRoteador((rota) => {
    void renderizarRota(rota);
  });
}

iniciar().catch((erro: unknown) => {
  console.error("Falha ao iniciar a aplicação.", erro);
  const destino = document.getElementById("app");
  if (destino) {
    destino.innerHTML = `
      <div class="falha-inicializacao">
        <strong>Não foi possível abrir o lida.</strong>
        <p>Recarregue a página e tente novamente.</p>
      </div>
    `;
  }
});
