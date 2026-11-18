import {
  campoCheckbox,
  campoTexto,
  botaoPrimario,
  rodapeRegistro,
} from "../componentes/formulario.js";
import { campoCodigo } from "../componentes/campo-codigo.js";
import { icone } from "../componentes/dom.js";
import { formatarTelefone } from "../utilitarios/formatadores.js";

function ajudaRodape(): string {
  return `<div class="auth-rodape">Precisa de ajuda? <a class="link" href="mailto:contato@lida.app">Fale com a gente</a></div>`;
}

export class AutenticacaoView {
  boasVindas(): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "boas-vindas";
    elemento.innerHTML = `
      <div class="boas-vindas-fundo"></div>
      <div class="boas-vindas-overlay"></div>
      <div class="boas-vindas-conteudo">
        <div class="boas-vindas-topo">
          <img class="boas-vindas-logo" src="assets/logo-branca.svg" alt="lida." />
          <p class="boas-vindas-lema">Gestão simples para quem vive da terra.</p>
        </div>
        <div class="boas-vindas-rodape">
          <button type="button" class="btn-boas-vindas-entrar" id="btn-entrar">Entrar</button>
          <button type="button" class="btn-boas-vindas-criar" id="btn-criar-conta">
            É seu primeiro acesso? <span>Crie sua conta</span>
          </button>
          <p class="boas-vindas-ajuda">Protótipo acadêmico · dados apenas nesta sessão</p>
        </div>
      </div>
    `;
    return elemento;
  }

  entrar(): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "auth auth-simples";
    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">
        ${icone("voltar")} Voltar
      </button>
      <div class="auth-simples-topo">
        <img class="auth-simples-logo" src="assets/logo-completa.svg" alt="lida." />
        <div>
          <h1 class="auth-titulo">Entre na sua conta</h1>
          <p class="auth-descricao">Informe seu celular. Enviaremos um código de 6 números para confirmar seu acesso.</p>
        </div>
      </div>
      <form class="auth-formulario" id="form-entrar" novalidate>
        <div id="erro-entrar" hidden></div>
        ${campoTexto({
          id: "telefone",
          label: "Telefone",
          tipo: "tel",
          inputmode: "tel",
          obrigatorio: true,
          placeholder: "(88) 99999-9999",
          autocomplete: "tel",
          maxlength: 15,
        })}
        ${botaoPrimario("Enviar código de acesso →")}
      </form>
      <div class="auth-rodape-form">
        ${rodapeRegistro()}
        ${ajudaRodape()}
      </div>
    `;
    return elemento;
  }

  confirmarCodigo(telefone: string): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "auth auth-simples";
    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">
        ${icone("voltar")} Voltar
      </button>
      <div class="auth-simples-topo">
        <img class="auth-simples-logo" src="assets/logo-completa.svg" alt="lida." />
        <div>
          <h1 class="auth-titulo">Confira seu celular</h1>
          <p class="auth-descricao">
            Enviamos um código de 6 números para ${formatarTelefone(
              telefone,
            )}. Digite abaixo para continuar.
          </p>
        </div>
      </div>
      <div class="auth-formulario">
        <div class="auth-codigo-info">
          ${icone("informacao")}
          <span>Neste protótipo, qualquer sequência de 6 números é aceita.</span>
        </div>
        <div id="erro-codigo" hidden></div>
        ${campoCodigo()}
        <div class="auth-codigo-acoes">
          ${botaoPrimario("Entrar", { id: "btn-confirmar" })}
          <p class="auth-reenviar">
            Não recebeu o código?
            <button type="button" class="link" id="btn-reenviar">Reenviar</button>
          </p>
        </div>
      </div>
      <div class="auth-rodape-form">
        ${rodapeRegistro()}
        ${ajudaRodape()}
      </div>
    `;
    return elemento;
  }

  criarConta(): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "auth auth-simples";
    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">
        ${icone("voltar")} Voltar
      </button>
      <div class="auth-simples-topo">
        <img class="auth-simples-logo" src="assets/logo-completa.svg" alt="lida." />
        <div>
          <h1 class="auth-titulo">Crie sua conta</h1>
          <p class="auth-descricao">Comece a organizar o dia a dia da sua propriedade.</p>
        </div>
      </div>
      <form class="auth-formulario" id="form-criar-conta" novalidate>
        <div id="erro-criar-conta" hidden></div>
        ${campoTexto({
          id: "nome",
          label: "Nome",
          obrigatorio: true,
          placeholder: "Como podemos chamar você?",
          autocomplete: "name",
        })}
        ${campoTexto({
          id: "telefone",
          label: "Telefone",
          tipo: "tel",
          inputmode: "tel",
          obrigatorio: true,
          placeholder: "(88) 99999-9999",
          autocomplete: "tel",
          maxlength: 15,
        })}
        ${campoTexto({
          id: "email",
          label: "Email (Opcional)",
          tipo: "email",
          inputmode: "email",
          placeholder: "voce@exemplo.com",
          autocomplete: "email",
        })}
        ${campoCheckbox(
          "termos",
          "Li e concordo com os termos de uso e privacidade",
          true,
        )}
        ${botaoPrimario("Criar conta")}
      </form>
      <div class="auth-rodape-form">
        ${rodapeRegistro()}
        ${ajudaRodape()}
      </div>
    `;
    return elemento;
  }
}
