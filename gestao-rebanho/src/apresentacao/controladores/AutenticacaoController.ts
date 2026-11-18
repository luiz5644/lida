import { ConfirmarCodigoAcesso } from "../../aplicacao/casos-de-uso/autenticacao/ConfirmarCodigoAcesso.js";
import { EnviarCodigoAcesso } from "../../aplicacao/casos-de-uso/autenticacao/EnviarCodigoAcesso.js";
import { IniciarSessaoUsuario } from "../../aplicacao/casos-de-uso/autenticacao/IniciarSessaoUsuario.js";
import { CriarUsuario } from "../../aplicacao/casos-de-uso/usuario/CriarUsuario.js";
import { IRepositorioSessao } from "../../dominio/repositorios/IRepositorioSessao.js";
import {
  ContextoTela,
  montarNaTela,
} from "../contexto.js";
import { ligarCampoCodigo, obterCodigo } from "../componentes/campo-codigo.js";
import {
  descreverErro,
  exibirErro,
  limparMensagemErro,
} from "../componentes/mensagem-erro.js";
import { mostrarToast } from "../componentes/toast.js";
import { AutenticacaoView } from "../visoes/AutenticacaoView.js";
import { apenasDigitos, formatarTelefone } from "../utilitarios/formatadores.js";

export interface DependenciasAutenticacao {
  enviarCodigo: EnviarCodigoAcesso;
  confirmarCodigo: ConfirmarCodigoAcesso;
  criarUsuario: CriarUsuario;
  iniciarSessao: IniciarSessaoUsuario;
  sessao: IRepositorioSessao;
}

export class AutenticacaoController {
  private readonly view = new AutenticacaoView();

  constructor(
    private readonly dependencias: DependenciasAutenticacao,
    private readonly tela: ContextoTela,
  ) {}

  boasVindas(): void {
    const elemento = this.view.boasVindas();
    montarNaTela(this.tela, elemento);
    elemento
      .querySelector<HTMLButtonElement>("#btn-entrar")
      ?.addEventListener("click", () => this.tela.navegar("entrar"));
    elemento
      .querySelector<HTMLButtonElement>("#btn-criar-conta")
      ?.addEventListener("click", () =>
        this.tela.navegar("criar-conta"),
      );
  }

  entrar(): void {
    const elemento = this.view.entrar();
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "boas-vindas");

    const telefone = elemento.querySelector<HTMLInputElement>("#telefone");
    telefone?.addEventListener("input", () => {
      telefone.value = formatarTelefone(telefone.value);
    });

    const form = elemento.querySelector<HTMLFormElement>("#form-entrar");
    form?.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const erro = elemento.querySelector<HTMLElement>("#erro-entrar");
      limparMensagemErro(erro);
      const digitos = apenasDigitos(telefone?.value ?? "");
      if (digitos.length < 10) {
        exibirErro(erro, "Informe um telefone válido com DDD.");
        return;
      }
      const botao = form.querySelector<HTMLButtonElement>("button[type=submit]");
      if (botao) {
        botao.disabled = true;
      }
      try {
        await this.dependencias.enviarCodigo.executar(digitos);
        mostrarToast("Código enviado por SMS simulado.");
        this.tela.navegar("confirmar-codigo");
      } catch (falha) {
        exibirErro(erro, descreverErro(falha));
      } finally {
        if (botao) {
          botao.disabled = false;
        }
      }
    });
  }

  confirmarCodigo(): void {
    const telefone = this.dependencias.sessao.obterTelefonePendente();
    if (!telefone) {
      this.tela.navegar("entrar");
      return;
    }
    const elemento = this.view.confirmarCodigo(telefone);
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "entrar");

    const erro = elemento.querySelector<HTMLElement>("#erro-codigo");
    const confirmar = async (): Promise<void> => {
      limparMensagemErro(erro);
      const codigo = obterCodigo(elemento);
      if (codigo.length !== 6) {
        exibirErro(erro, "Digite os 6 números do código de acesso.");
        return;
      }
      const botao = elemento.querySelector<HTMLButtonElement>("#btn-confirmar");
      if (botao) {
        botao.disabled = true;
      }
      try {
        await this.dependencias.confirmarCodigo.executar(codigo);
        mostrarToast("Acesso confirmado. Bem-vindo(a)!");
        this.tela.navegar("inicio");
      } catch (falha) {
        exibirErro(erro, descreverErro(falha));
      } finally {
        if (botao) {
          botao.disabled = false;
        }
      }
    };

    ligarCampoCodigo(elemento, () => {
      limparMensagemErro(erro);
    });
    elemento
      .querySelector<HTMLButtonElement>("#btn-confirmar")
      ?.addEventListener("click", () => {
        void confirmar();
      });
    elemento
      .querySelector<HTMLButtonElement>("#btn-reenviar")
      ?.addEventListener("click", async () => {
        try {
          await this.dependencias.enviarCodigo.executar(telefone);
          mostrarToast("Novo código enviado.");
        } catch (falha) {
          exibirErro(erro, descreverErro(falha));
        }
      });
  }

  criarConta(): void {
    const elemento = this.view.criarConta();
    montarNaTela(this.tela, elemento);
    this.ligarVoltar(elemento, "boas-vindas");

    const telefone = elemento.querySelector<HTMLInputElement>("#telefone");
    telefone?.addEventListener("input", () => {
      telefone.value = formatarTelefone(telefone.value);
    });

    const form = elemento.querySelector<HTMLFormElement>(
      "#form-criar-conta",
    );
    form?.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      const erro = elemento.querySelector<HTMLElement>("#erro-criar-conta");
      const erroTermos = elemento.querySelector<HTMLElement>("#erro-termos");
      limparMensagemErro(erro);

      const nome = elemento.querySelector<HTMLInputElement>("#nome")?.value.trim();
      const digitos = apenasDigitos(telefone?.value ?? "");
      const email =
        elemento.querySelector<HTMLInputElement>("#email")?.value.trim() ?? "";
      const aceitouTermos =
        elemento.querySelector<HTMLInputElement>("#termos")?.checked ?? false;

      if (!nome) {
        exibirErro(erro, "Informe seu nome.");
        return;
      }
      if (digitos.length < 10) {
        exibirErro(erro, "Informe um telefone válido com DDD.");
        return;
      }
      if (!aceitouTermos) {
        exibirErro(
          erroTermos,
          "É necessário aceitar os termos de uso e privacidade.",
        );
        return;
      }
      limparMensagemErro(erroTermos);

      const botao = form.querySelector<HTMLButtonElement>("button[type=submit]");
      if (botao) {
        botao.disabled = true;
      }
      try {
        const usuario = await this.dependencias.criarUsuario.executar({
          nome,
          telefone: digitos,
          email: email || undefined,
          aceitouTermos,
        });
        await this.dependencias.iniciarSessao.executar(usuario.id);
        mostrarToast("Conta criada com sucesso.");
        this.tela.navegar("onboarding");
      } catch (falha) {
        exibirErro(erro, descreverErro(falha));
      } finally {
        if (botao) {
          botao.disabled = false;
        }
      }
    });
  }

  private ligarVoltar(raiz: HTMLElement, destino: string): void {
    raiz
      .querySelector<HTMLButtonElement>("#btn-voltar")
      ?.addEventListener("click", () => this.tela.navegar(destino));
  }
}
